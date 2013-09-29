Storm 指南
====

在这个指南中，你将学到如何建立一个 storm 的拓扑结构，并且将其部署到 Storm 集群中。Java 是主要使用的语言，但是其中部分例子使用了 Python，以说明 Storm 的多语言的兼容性。

# 前言

这个指南，使用了来自 “storm-starter” 项目的例子。建议你克隆这一项目并且依照其中的例子。首先，阅读 “Setting up development environment” 与 “Creating a new Storm project”。

# Storm cluster 的组件

一个 Storm 集群在表面上看，类似一个 Hadoop 集群。但是，在 Hadoop 中，你运行的是“MapRudce jobs”，但是在 Storm 中，你运行的是“topologies（拓扑结构）”。“Jobs” 和“topologies”有着很大的不同 —— 一个核心的不同，就是一个 Mapreduce job 最终能够运行完成，而一个 topology 进程将永远有效（除非你杀了它）。

在 Storm 中，有两种类型的节点：master 节点和 worker 节点。master 节点运行了一个被称为 “Nimbus” 的守护进程（与 Hadoop 中的 JobTracker 类似）。Nimbus 用于在集群间分发代码，将任务交给不同的机器以及对失败进行监控。

每一个 worker 都运行了一个被称为 “Supervisor” 的守护进程。supervisor 监听了被分配到它机器上的工作，并且根据 Nimbus 分配给它的任务来启动、关闭 worker。每一个 Worker 进程都运行一个 topology（拓扑）的子集；一个运行着的 topology 包括了很多分布在不同的机器上的 worker。

所有在 Nimbus 和 Supervisor 之间的协同工作均通过了 Zookeeper 集群。另外，Nimbus 守护进程和 Supervisor 守护进程是 fail-fast 和 stateless 的；所有状态都保存在 Zookeeper 和本地硬盘上。这意味着你可以使用 kill -9 强制杀死 Nimbus 和 Supervisor 的进程，而它们仍将不受影响地启动。这样的设计使得 Storm 集群变得非常稳定。

# Topologies （拓扑）

为了能够在 Storm 上进行实时运算，你需要创建被称为是 “Topologies” 的结构。一个 topology 是。每一个在 topology 中的节点都包含了运算逻辑（processing logic），并且根据数据在不同节点间的流通来组织各个节点。

运行一个 topology 是非常简单的。首先，你将你的代码与以来都打入到一个 jar 中，其次，你按照下面的命令运行：

{%starthighlight bash%}
    storm jar all-my-code.jar backtype.storm.MyTopology arg1 arg2
{%endhighlight%}

这一命令使用参数 arg1 和 arg2 运行了 backtype.storm.MyTopology 的这个类。在这个类的 main 函数中定义了这个 topology 并且将其传递给 Nimbus。而 storm jar 部分将连接上 Nimbus 并且把包上传上去。

因为 topology 的定义，是一个 Thrift 的结构，并且 Nimbus 是一个 Thrift 服务器。所以你能够用任意编程语言来创建和递交这一结构。上面的例子就是使用 JVM-based 的语言来实现的 Storm topology。参考 Running topologies on a production cluster 来获知更多的信息。

# Streams （流）

在 Storm 中，核心的抽象是 “stream”。流，是一个元组的无界序列。Storm 提供了将一个流转换成另外一个流的一个分布式的可靠的途径。比如说，你能够把 tweets（应该 twitter 的分散性的话题） 的流，转换成一个有一定趋势话题的流。

Storm 提供的最基础的用于流的转换的功能是 “spouts（管道）” 和 “bolts（螺栓）”。Spouts 和 bolts 都有供你实现的接口用于运行你自己的程序逻辑。

spout（管道）是 stream（流）的源。比如说，一个管道能够读取 Kestrel 队列中的数据，并且将他们作为一个 stream（流）发送出去。或者可以从一个 Twitter 的 API 中读取数据，组成一个 tweets 的流发送出去。

bolt（螺栓）对进入的任何流进行消费，做一些处理，甚至产生新的流。复杂的流转换，比如将 tweets 的流，转换成一个有一定趋势话题的流，需要进行多步的处理，即有多个 bolts（螺栓）。Bolt 能够做任意的流处理，比如说运行程序、过滤元组、不同流的交流、不同流的聚合、写入数据库等等工作。

spout（管道）和 bolt （螺栓）的网络被打包进入了一个“topology（拓扑）”的最高层次的抽象来给 Storm 集群进行运行。一个 topology 是一个包括了每一个是 spout 或者 bolt 节点的 stream 的转换的流的图。在这个图中的边，代表了这个流将要去哪一个 bolt。当一个 spout 或者 bolt 将元组组成为 stream（流），它将这些元组发送给订阅了该 stream 的 bolt。

在你的 topologies 中节点之间的链接表明了元组将如何被传递出去。比如说，如果在 Spout A 和 Bolt B 之间有一个链接，Spout A 和 Bolt C 之间、在 Bolt B 和 Bolt C 之间有链接，那么每次 A 构成了一个流，这个流将流向 B、C；同时，B 产生的结果也将进入 C。

每一个 Storm 的节点都并行地运行着。在你的 topology（拓扑）中，你能够区分，每一个节点，你会需要多少并向，而这个 Storm 能够产生这些数量的线程用于这一运行。

一个 topology 将永远运行，除非你杀了它。Storm 将自动重新分配失败的任务。同时，Storm 也保证了，这其中将不会有数据的丢失，甚至包括在机器宕机、信息被挂断的情况。

# 数据模型（Data model）

Storm 使用了元组来作为它的数据模型。一个元组是一个具有值的有名列表，同时在一个元组中的域，可以是任意类型的实体。跳出这里，Storm 支持了所有原始类型，字段、字节数组等等来作为元组域值。如果需要使用一个其他类型的实体，那么，你需要为这个类实现一个序列。

每一个在 topology 中的节点都需要声明这个节点所发送的元组的输出域。比如说，这个 bolt 定义了它聚集了 2个元组 的输出域（ double 与 triple ）：

```java
    public class DoubleAndTripleBolt extends BaseRichBolt {
        private OutputCollectorBase _collector;

        @Override
        public void prepare(Map conf, TopologyContext context, OutputCollectorBase collector) {
            _collector = collector;
        }

        @Override
        public void execute(Tuple input) {
            int val = input.getInteger(0);        
            _collector.emit(input, new Values(val*2, val*3));
            _collector.ack(input);
        }

        @Override
        public void declareOutputFields(OutputFieldsDeclarer declarer) {
            declarer.declare(new Fields("double", "triple"));
        }
    }
```

这里的 declareOutputFields 函数，给这个组件定义了输出域：“["double", "triple"]”。在这个 bolt 中其他部分会在下面解释。

# 一个简单 topology

我们先看一个简单的 topology 来更为深入地研究这个话题，并且看看这个代码是如何组织的。让我们看下面在 storm-starter 中定义的 ExclamationTopology：

```java
    TopologyBuilder builder = new TopologyBuilder();
    builder.setSpout("words", new TestWordSpout(), 10);
    builder.setBolt("exclaim1", new ExclamationBolt(), 3)
            .shuffleGrouping("words");
    builder.setBolt("exclaim2", new ExclamationBolt(), 2)
            .shuffleGrouping("exclaim1");
```

这个 topology 包括了一个 spout 和两个 bolt。spout 产生单词，而每个 bolt 在后面追加 "!!!"；而这些节点使用了一条线连接起来。首先运行第一个 bolt，其次运行第二个 bolt。比如在 spout 中输入元组 ["bob"] 和 ["john"]，那么在第二个 bolt 中输出的是 ["bob!!!!!!"] 和 ["john!!!!!!"]。

这段代码使用 “setSpout” 和 “setBolt” 来定义了节点。这些函数使用了一个用户定义的 id，一个具有处理逻辑的实体，以及你需要这些节点处理的并行数目。在这个例子上，这个 spout 具有 id 为 “word”，而其他的 blots 分别是 "exclaim1" 和 "exclaim2"。

这个实体包含了使用 IRichSpout 给 Spout 的接口，以及 IRichBolt 给 Bolt 的接口。

在最后一个参数中，你能够给这个 node 多少并发量。它定义了你在集群上的模块能够运行多少线程。如果你不使用它，那么 storm 将只给他分配一个线程。

setBolt 返回了一个  InputDeclarer 实体用于定义给 Bolt 的输入。这里，模块 “exclaim1” 定义了他将使用随机分组方式读取自于 “words” 的元组。而 “exclaim2” 则定义了它将读取来自模块 “exclaim1” 的元组。"shuffle grouping" 以为了这些输入元组将被随机地分配到 bolt 的任务中。这里会有很多将这些数据在模块见组织的方法，并且能够使用一些章节解释。

如果你希望 exclaim2 同时读取来自 words 和 exclaim1 的元组，那么你可以做下面的定义：
    
```java
    builder.setBolt("exclaim2", new ExclamationBolt(), 5)
            .shuffleGrouping("words")
            .shuffleGrouping("exclaim1");
```

正如你所见的，输入定义能够被串联起来用于支持多种 Bolt 的数据源。

让我们深入看看 spout 和 bolt 在 topology 中的实现。Spouts 用于将新的消息引入到 topology 中。在这个 topology 中的 TestWordSpout 每隔 100ms 组织一个在  ["nathan", "mike", "jackson", "golda", "bertels"]  中的随机的文字作为一个 1元素元组。在这里的 nextTuple 的实现方式如下：

```java
    public void nextTuple() {
        Utils.sleep(100);
        final String[] words = new String[] {"nathan", "mike", "jackson", "golda", "bertels"};
        final Random rand = new Random();
        final String word = words[rand.nextInt(words.length)];
        _collector.emit(new Values(word));
    }
```

如你所见，这个实现相当的简单。

ExclamationBolt 在每一个字段后面都追加了“!!!”。下面就是它的实现：
```java
    public static class ExclamationBolt implements IRichBolt {
        OutputCollector _collector;

        public void prepare(Map conf, TopologyContext context, OutputCollector collector) {
            _collector = collector;
        }

        public void execute(Tuple tuple) {
            _collector.emit(tuple, new Values(tuple.getString(0) + "!!!"));
            _collector.ack(tuple);
        }

        public void cleanup() {
        }

        public void declareOutputFields(OutputFieldsDeclarer declarer) {
            declarer.declare(new Fields("word"));
        }
        
        public Map getComponentConfiguration() {
            return null;
        }
    }
```
prepare 函数提供了一个使用 OutputCollector 的 bolt。元组能够在 bolt 的任意地方进行组织，在 prepare、execute 或者 cleanup 函数中，甚至能够在另外一个线程中异步完成。这个 prepare 函数的实现将 OutputCollector 保存为一个实体的值以提供之后的 execute 函数使用。

execute 函数获取了一个输入的元组。这个 ExclamationBolt 抓取了来自元组的地一个域，并且在其后追加了“!!!”作为一个新的元组。如果你实现了一个订阅了多个输入原的 bolt，你可以使用 “Tuple#getSourceComponent” 获取到这个元组来自于哪一个模块。

这里也有其他在 execute 中进行的事情，换句话说，这些输入的元组是作为地一个参数给 emit，而这个输入的元组也作为最后一行进行了确认。这些就是 Storm API 用于保证没有数据丢失的一部分，并且将在之后被提到。

cleanup 函数将在 bolt 被关闭的时候运行，并且清理所有已经被开启的资源。这里并没有一个这个函数一定会被集群调用的保证；比如说，如果机器、任务是























