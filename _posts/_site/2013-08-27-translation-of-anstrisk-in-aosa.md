{:toc}
---
layout: trancelation
title:  "Translation of anstrisk in AOSA "
date:   2013-08-27 06:20:24
categories: translation
---

Asterisk
========

Asterisk 是一个发布在 Gplv2 下的开源的电话软件。简而言之，它是一个提供了打电话、接电话以及定制电话服务的服务软件。

该项目由 Mark Spencer 于1999 年启动。当时，Mark 有一个叫做 Linux Support Services 的公司，并且他需要一个电话系统用于帮助他运作这一贸易。但是，他并没有足够多的钱来购买一个电话服务，所以他决定自己做一个。随着 Asterisk 的流行与发展， Linux Support Services 将其业务转向了 Asterisk，同时公司也更名为 Digium, Inc。

Asterisk 这个名字来源于 Unix 的通配符，*。这也代表着 Asterisk  项目的目标 —— 支持所有和电话相关的事务。追求这一目标，现在，Asterisk 支持了一大串关于打电话、接电话的技术，包括很多 VoIP（Voice over IP） 协议，从模拟连接与数字连接到传统电话网络，或者是 PSTN（Public Switched Telephone Network）。支持多种类型的电话服务接入，是 Asterisk 的一个主要优势。

一旦电话是由 Asterisk 系统接入或者打出的，这里也提供了很多附加功能用于定制这一电话过程。有些功能是大型的、预先完成的通用软件服务，比如 voicemail。同时，其他的小型功能也能够内组合起来用于提供一个定制的声音（电话）软件，比如回放音频文件、读取数字，以及声音识别等等。

##关键架构概念

这一节将讨论一些Asterisk所有模块的架构概念。这些想法就是Asterisk 的架构基石。

###Channels（频道）

在Asterisk 中的一个频道，表现了Asterisk系统与其他电话终端的一个连接。在Asterisk中，最为通用的一个例子，就是一个电话（或手机）给Asterisk系统打了一个电话。而这一连接，变表示为一个单个channel。在 Asterisk 的代码中，一个 channel 作为ast_channel数据结构的一个实例而存在。比如说，这个场景可以是一个与voicemail的交互。

###Channel Bridging（频道桥接）

一个更为熟悉的通讯场景应该是两个电话之间的连接通讯了，比如说一个人使用了 Phone A 呼叫了另外一个拥有 Phone B 的人。在这一呼叫场景中，有两个电话终端连入了 Asterisk 系统，同时，系统将有两个 channel。

当Asterisk频道以该方式连接的时候，可以称之为一个channel bridge（连接桥）。Channel Bridging 是一个为了传输两个频道之间媒体而将它们连接在一起的动作。一般来说，媒体流将是音频流，但是，在电话中，也有可能存在着视频流和文字流，甚至会有多种媒体流并存的情况（比如同时有音频和视频）。而这些情况都需要 Asterisk 系统中发起的一个 channel 来掌控。比如说，在例子中，这里有 Phone A 和 Phone B 接入地两个频道，Asterisk 建立了一个 Bridge 用于传输从 Phone A 流向 Phone B 的流，同时，也将传输从 B 到 A的流。所有的媒体流都将在Asterisk 中被解析。任何 Asterisk不能够了解并且拥有完全控制的协议（或者其他）都是不被支持的。这就是说，Asterisk 能够对不同技术之间的通话进行录制、音频修改以及翻译。

这里能够使用两种方法将两个频道给连接到一起：通用桥接（generic bridging）和原生桥接（native bridging）。通用连接的工作关注 channel 的连接技术，它使用 Asterisk 抽象 channel 接口来传输所有的音频与信号。这是最为灵活的桥接方式，同时，这也是效率最低的连接方式（因为抽象层必须需要一个任务地完成才能够进行解析）。

原生桥接，是一个具有技术特性地（technology specific）的连接方式。如果两个连接向Asterisk 的channel 使用了相同的没听传输技术，那么，将会有比使用抽象层更为高效地连接方式（因为抽象层是Asterisk用于连接不同技术的通讯方式而引入的）。比如说，如果有专门的硬件用于连入这个电话网络，那么这个系统将可能直接使用其中的硬件来对这些设备进行连接，因此，媒体流将并不必须流过该系统。比如说一些 VoIP的协议，系统将直接连接不同终端之间的媒体流，而只有一些呼叫信号信息才经过系统。

这两者协议将在两个频道进行连接的时候进行选择。如果两个 channel 都支持同样的原生连接方式，那么原生连接将被选择。否则，将使用通用连接。为了区分这两个 channel 是否支持同样的桥接方法，这里用了一个简单的 C 函数指针。虽然这不是最高雅的方法，但是我们发现这已经满足了需求。如何提供一个更加高雅地channel 方式，将在第二章节提到。

###Frames（帧）

在Asterisk 的代码中，一个电话（call）使用 Frames 进行通讯，在数据结构中表现为 ast_frame。Frames 可以是媒体的帧，也可以是信号的帧。在一个最基本的电话呼叫中，一个媒体的帧包括了系统将进行传输的音频信息。而信号帧将用于发送有关电话的信号事件，比如说一个按下去的按钮、一个将被挂起的电话、或者一个挂掉的电话。

支持的 Frames 是作为列表静态配置好的，使用数字编码的类型与之类型来表示。具体的列表能够在include/asterisk/frame.h 在找到；下面是一些例子：

* VOICE：这些帧传输音频流
* VIDEO：这些帧传输视频流
* MODEM：这个帧使用的编码方式，比如说 T.38 代表了在 IP 上面发送传真。这一帧类型地主要用途是用于发送传真。对于文字的传输来说，这将十分重要，这样所有的数据帧能够被留下来而不受外界干扰，使得另一端能够进行解码。这和音频不同，因为音频能够使用音频解码器压缩音频质量用于节省带宽。
* CONTROL：这是一个帧说表明的呼叫信号消息。这些帧用于表明呼叫信号时间。这些事件包括了电话被接了、被挂了或者被挂起了或者其他的。
* DTMF_BEGIN：当用户按下DTMF按钮的时候，这个帧表示了开始的那个数字
* DTMF_END：当用户按下DTMF按钮的时候，这个帧表示了结束的那个数字

##Asterisk 模块抽象

Asterisk 是一个高度模块化的程序。这里有一个在代码树中main目录下面的代码编译而成的核心程序。但是，单单这个模块对于它本身来说，并不非常有用。核心模块主要的功能在于其他模块的注册。同时，该模块含有连接所有抽象接口使得通话工作的代码逻辑。具体对这些接口是由在其中注册并且载入的模块在运行时候实现的。

在默认情况下，所有的模块都放置在预定好的 Asterisk 模块目录中以文件系统的方式存在，这样当 Asterisk 启动的时候，这些模块将被加载起来。因为这样做十分简单，所以得到了采用。同时，这里也有一个配置文件用于指定需要载入哪些模块，以及这些模块的载入顺序是怎么样的。虽然这使得配置变得略微复杂，但是，该方法提供了对模块载入与否、顺序地控制功能。同时，这里也有一定地安全好处。最好的方式，便是不要加载你不需要的，但是能够接受网络请求的模块。

当这些模块被加载起来的时候，Asterisk 核心模块将会注册这些模块的实现方式。Asterisk 提供了多种多样的接口使得模块能够进行注册实现。一个模块能够实现其任意接口，但是一般来说，具有功能相关性的方法将被聚合在一个单独模块中。

###Channel Drivers（频道驱动）

Asterisk 频道驱动接口是其中最复杂并且最重要的接口。Asterisk channel API 提供了所有 Asterisk 支持的通话协议的抽象。这个模块用于Asterisk channel 抽象层之间的转换与其中通讯技术的具体实现。

Asterisk channel 驱动接口的定义是在ast_channel_tech 接口中。该接口定义了必须由驱动实现的一系列接口。其中，第一个需要实现的接口，便是 一个ast_channel 的工厂方法，该方法是在 ast_channel_tech接口中的 请求程序（requestor）。但一个 Asterisk channel被创建了，不论是通讯的发起方还是接收方，ast_channel_tech 的相关实现中，都必须调用ast_channel 函数来实例化与初始化相关类型（通讯技术）的channel。

当一个ast_channels 被创建的时候，它会拥有一个创建它的ast_channel_tech 的引用。这里会有很多与使用的通讯协议相关的操作必须在该channel 实体中得到控制。这些操作的控制将被递延（deferred to）到ast_channel_tech中的特定方法。

在ast_channel_tech中最重要的函数有如下几个：

 * requester：这个回调函数被channel driver 用来实例化一个ast_channel 实体，并且根据channel类型进行初始化
 * call：这个回调函数被用于初始化一个对一个由ast_channel所表现的呼叫
 * answer：当Asterisk 据丁接听进来的电话的时候，将调用该函数
 * hangup：如果系统检测到该电话应该被挂断，那么将调用该函数。然后频道驱动将会在协议定义层面，告知终端，该呼叫结束了。
 * indicate：当一个呼叫启动时，会有其他一系列的事件产生，并且需要通知到一个终端。比如说，这个设备选择挂起电话，那么。这个回调函数将被使用来表明这一事件。这里或许会有协议层面的东西来表明这个电话被挂起，或者这个频道驱动将简单地播放一个音乐用于表明。
 * send_digit_begin：用于表明DTMF 被使用来向系统发信的开始。
 * send_digit_end：用于表明DTMF 被使用来向系统发信的结束。
 * read：这个函数是Asterisk core模块用于向一个ast_frame 读回信息的函数。一个 ast_frame是一个被Asterisk用作媒体压缩（如视频、音频）的抽象层，就像信号事件一样。
 * write：写函数用于向设备发送一个 ast_frame，频道设备将获取数据并且根据其实现低通讯协议进行打包，同时发送给终端。
 * bridge：这是原生桥接（native bridging）使用的回调函数。就像之前提到的，当两个设备支持同样的协议时，该连接方式能够使用更加高效的连接，用于发送与抽象层无关的媒体信息。这个接口为了性能的提升而变得十分重要。
 * hangup： 当一个电话结束的时候，还存活着的抽象的channel层会使用其中引用的 ast_chennl_tech，调用 hangup 回调函数，并且摧毁自身。

###拨号计划程序（Dialplan Applications）

Asterisk 管理员能够使用 Asterisk Diaplan 来配置呼叫路由（配置在/etc/asterisk/extensions.conf中）。该呼叫计划由一系列叫做扩展的规则组成。当一个系统得到了一个电话，电话号码用于寻找这个拨号计划中的扩展用于进行这次通话。这些扩展包括了一个拨号计划程序的列表，并且将由channel运行。这些拨号计划程序也是又程序在载入模块的时候就注册好的。

Asterisk 有将近200个扩展程序。对于程序的定义是十分宽松的。程序能够使用任何Asterisk 的内部API 来实现两个频道之间的交互。一些程序只完成一些简单的工作，比如播放一段音频。有些程序将完成一系列复杂地大型工作，比如说Voicemail 程序。

使用 Asterisk Diaplan，多种程序能够被用在一起从而来完成一次呼叫计划。如果需要有更加多地定制需求，那么Asterisk 也提供了一套支持多种语言的脚本接口用于用户完成根据深层次的定制。就算使用另外一种语言来实现这一脚本接口，dialplan 仍然能够很好地完成频道之间的交互。

在开始例子前，可以先了解一下Asterisk Diaplan呼叫1234的语法。注意，这里的1234是一个随机数。这里会使用三个拨号计划程序，首先，它接听了电话，其次，它播放了一个音频。最后，它挂断了电话。

{% highlight ruby %}
# Define the rules for what happens when someone dials 1234.
#
exten => 1234,1,Answer()
    same => n,Playback(demo-congrats)
    same => n,Hangup()
{% endhighlight %}

exten这个关键字用于定义这个扩展。在exten的右边，1234 代表了系统将对呼叫1234的人所定义一定地规则。接下来的1代表了这个号码被拨叫时的第一步。最后，Answer 告知系统来接听电话。接下来的两行使用 same 来开始规则，代表着这是上面说设置的最后一个扩展（在这里是对1234的定制）。n是 next 的缩写，用于表明这是下一步。最后的两个，都代表了其采取的行为。

下面是另一个使用 Asterisk Diaplan 的例子。在这个用例子中，一个进来的呼叫将被接听。这个呼叫播放了一个beep声，同时会有4个数字从呼叫方读入，并且存入 DIGITS 这个变量中。最后，这个数字将但会给呼叫方。最后，挂断。

{% highlight ruby %}
exten => 5678,1,Answer()
    same => n,Read(DIGITS,beep,4)
    same => n,SayDigits(${DIGITS})
    same => n,Hangup()
{% endhighlight %}

就像之前所说，这些程序定义都非常的松散——方法的协议注册是相当地简单：

{% highlight c %}
int (*execute)(struct ast_channel *chan, const char *args);
{% endhighlight %}

同时，能够用于实现的函数可以在 include/asterisk 中找到。

###拨号计划函数（Dialplan Functions）
很多拨号计划程序将获取一串的参数。而有些字将很难静态的表示出来，而需要更多动态地行为。接下来的例子就展示了一个拨号计划小片，它设置了一个值，并且将其传给Asterisk 使用Verbose程序的命令行接口。

{% highlight ruby %}
exten => 1234,1,Set(MY_VARIABLE=foo)
    same => n,Verbose(MY_VARIABLE is ${MY_VARIABLE})
{% endhighlight %}

拨号计划函数在呼叫的时候使用和之前例子中相同的语法。Asterisk 模块能够注册那些从拨号计划中获取信息并且返回的函数。另外，这些函数还能够从拨号计划中获取参数并且在上面采取一定的行为。作为一条基本原则，这些函数需要配置或者获取channel 的原数据，他们不应该做与信号、媒体处理有关的工作。这些工作是给拨号计划程序的。

下面这个例子示范了拨号计划函数的一个用处。首先，它将该频道用户ID打印到Asterisk的命令行接口。接下来，它使用set函数更新了用户ID。在这个例子里面，Verbos、set都是程序，而CALLERID是一个函数。

{% highlight ruby %}
exten => 1234,1,Verbose(The current CallerID is ${CALLERID(num)})
    same => n,Set(CALLERID(num)=<256>555-1212)
{% endhighlight %}

这里，一个拨号计划函数是需要的，因为CallerID信息是作为一个数据结构存储在ast_channel之中的。这个函数代码能够懂得如何获取到其中的值。

另外一个例子使用了拨号计划函数来给呼叫日志添加定制信息，这里称之为 CDRs。这个函数能够对记录信息继续检索以及添加信息:

{% highlight ruby %}
exten => 555,1,Verbose(Time this call started: ${CDR(start)})
    same => n,Set(CDR(mycustomfield)=snickerdoodle)
{% endhighlight %}

如上，这里的 CDR 便是一个函数

###编解码

使用VoIP的时候，不同的编码器被用于在网络间传输媒体信息。这些编码器的选择，能够让用户选择不同的媒体质量，用于适应CPU、带宽等等。Asterisk支持了多样性的解码器，并且知道如果在需要的时候在他们之间进行翻译。

当一个呼叫开始，Asterisk将尝试着使用在两个终端上使用通用媒体解码器，这样变不需要进行转码。但是，这并不是经常可行。就算使用了同一个解码器，转码过程可能还是需要的。比如说，如果Asterisk被配置为对音频做一些信号处理（比如说改变音量），那么Asterisk 需要将这些音频解码成无压缩的情况，这样，才能够进行信号的处理。Asterisk 也能够被配置成进行录音。如果配置成录制不同格式地音频，那么转码还是需要的。

####编解码交涉（决定）

该函数用于交涉（决定）不同地连接入Asterisk 的技术应该使用哪一个编码器。在很多情况下面，比如说，在传统电话网络的呼叫中，并不需要太多地交涉；但是，在其他的用例中，特别是使用IP协议，这里需要有一个交涉机制，用于选择两者都使用的编码。

比如说，在SIP的用例中，这里将使用一个比较高层面的视角来展示编码器地选择。

* 终端给 Asterisk 发送一个新的请求中包含了它将使用的编码器列表。
* Asterisk 会对其中由管理员说配置的编码器中列表中的期望编码器顺序进行对照。并且根据配置，返回其选择的编码器（发送列表与配置列表的交际部分）。

在这里，Asterisk 将无法很好地掌握更加复杂的编解码器，特别是视频。在过去十年里面，编码器的选择需求变得越来越复杂。并且团队花费了很多工作用于对新的编解码器的支持。这也是最新版本中优先级最高的一个需求。

编码翻译模块提供了对ast_translator的一个或者多个实现接口。一个翻译器拥有了解码源以及解码解码去处这两个属性。同样的，它也提供了一个回调函数用于将一块（chunk）媒体数据进行格式转换。该模块与电话通讯完全解耦合，它仅仅知道如何将一个媒体从一个编码转换成另外一个编码。

对于更多的接口，可以查看include/asterisk/translate.h与main/translate.c。对于其中的实现，可以在codecs目录中找到。

##多线程

Asterisk 是一个大量多线程的程序。它使用了POSIX threads API 来管理线程，以及相关的线程服务，比如锁。所有Asterisk 中与线程有交互的代码，都使用了一系列用于debug目的的封装。很多线程在Asterisk中都能够被很好地分类开来，比如说Network Monitor Thread 或者 Channel Thread。

###网络监控线程（Network Monitor Thread）

在每一个主要的频道驱动中，该线程都存在着。这些线程用于对它们所连接着的任何网络进行监控（不论是IP网络、PSTN网络等等），并且对进来的通话请求或者是其他请求进行监控。这些线程掌控了初始化地连接配置，比如说验证与号码确认。一旦呼叫配置完成，这些线程会创建一个Asterisk channel（ast_channel）的实例。，并且启动一个channel thread用于控制这个呼叫的生命线。

###频道线程（Channel Threads）

就像之前所说，一个频道是Asterisk的功能性概念。频道可以是入站的也可以是出站的。一个入站频道是由Asterisk在电话进来的时候创建的频道。这些频道能够用来运行Asterisk diaplan。这些threads 变被称作channel threads。

拨号计划程序一般是运行在频道线程的上下文中的。拨号计划函数也基本上都是如此。当然，使用一些异步的读写接口，比如Asterisk CLI，来完成一些异步操作，也是可行的。但是，在使用异步的时候，ast_channel 这个实例仍然由这个线程说掌握，并且决定着它的生命周期。

##呼叫场景

在之前的章节中，介绍了Asterisk模块最重要的接口，比如说线程运行模块。在这个章节中，一些基本的使用场景将被拿出来，用于告诉读者，这些Asterisk 模块是怎么进行交互的。

###检查Voicemail

一个用户场景是当有些用户需要接入呼叫系统来检查他们的Voicemail。第一个主要的模块在这个场景中所涉及到的是channel driver。频道驱动将用于处理从电话进来的呼叫请求，这里涉及到channel driver的monitor thread。基于这个驱动所使用的电话技术，这里将调用一些谈判函数用于配置这个呼叫。另外一步与配置呼叫有关的，是确定这个呼叫的去处。该去处往往是由呼叫的号码所决定的。但是，在有些情况下面，并没有说指定的号码用于完成这一项任务。比如有人在进行一次模拟呼叫。

如果channel driver 确认 Asterisk 配置有关于这个呼叫号码的拨号计划配置（拨号路由配置），那么它将分配一个 Asterisk 频道的实例，并且创建一条频道线程。这条线程将单独地对接下来的电话进行操作。

Channel thread的主循环将控制 diaplan 的运行。它会根据diaplan扩展中的配置，一步一步地进行运行。比如，下面的这个例子是一个voicemail的配置：

{% highlight ruby %}
exten => *123,1,Answer()
    same => n,VoicemailMain()
{% endhighlight %}

当这个channel threa运行了Answer这个程序，Asterisk 能够对进来的呼叫进行应答。应答呼叫需要对通话技术进行特殊处理，这样的话，有些基本的回应便能得到处理。这个answer函数在ast_channel_tech中进行调用用于回答呼叫。这里会涉及到返回一个特定的包等等。

下一步是channel thread用于运行VoicemailMain。这个程序又app_voicemail模块提供。最需要值得注意的是，在该模块进行大量通话交互的时候，它对外面进行数据传输的技术（通讯协议等）是毫不知的。Asterisk channel 抽象层，将这一细节隐藏了起来。

这里，在进行Voicemail访问的时候会涉及到很多其他的功能。但是，所有的这些中，最主要的就是对读入、写出的音频文件方式进行实现，这样才能够给用户以反馈，以及对用户按入的数字进行处理。DTMF 在Asterisk中能够以多种方式进行传输。同样的，其中的细节由 channel driver进行掌握。当一个按钮按下的时候，它会被转换成一个通用的按键事件，并且被传递给Voicemail。

一个需要被着重讨论的接口是编码解释器。这些编码的实现，在呼叫场景中间是非常的重要。当一个Voicemail的代码将用于播放一段音频的时候，这个音频的编码可能在系统与呼叫终端间有差异。如果我们必须进行音频转码，那么转码器的位置将处于音频源（Voicemail）与音频的去处（channel）之间。

同样的，一个呼叫也将在Voicemail系统中完成交互并且挂断。这个channel driver会对此进行检测，并且将这个动作转换成Asterisk channel信号时间。Voicemail 会获取到该事件并且退出（因为在呼叫者挂断之后不需要做任何事情）。控制器会返回到channel threal的主循环位置，并且完成dialplan的退出。因为这个例子没有更多的操作要做，所以在此之后，会进行hangup操作，将ast_channel实例给摧毁。

###桥接呼叫（Bridged Call）

另外一个常见的呼叫用户场景是在两个channel之间的桥接通话。该场景发生在一个电话使用该系统呼叫另一个电话。初始化的例子与上面Voicemail一样，不同的之处在于电话开始的时候，这些channel是如何运行diaplan的。

接下面的diaplan是一个简单的桥接通话的例子。使用这个扩展，当拨打1234电话的时候，这个diaplan会运行Dial程序，该程序用于初始化一个对外的呼叫。

{% highlight ruby %}
exten => 1234,1,Dial(SIP/bob)
{% endhighlight %}

在Dial中指定的参数说明了这个系统使用SIP/bob来进行通话。SIP指定了将使用SIP协议来传输这个通话，bob将被实现了这一协议的channel driver（chan_sip）所解释。假设这个频道驱动已经被配置成了一个叫做bob的帐号，那么这个协议将知道如何到达bob的电话。

Dial程序将向Asterisk做一个请求，来分配一个新的使用SIP/bob标识符的Asterisk频道。核心会请求SIP channel driver 来进行这一有关技术细节的初始化。接下来，频道驱动会初始化一个用于呼叫电话的过程。在请求进行过程中，它会将这个事件推送会Asterisk 核心，核心模块会将其传送给Dial 程序，这样Dial程序便获得了这一事件。这些事件将包括呼叫是否被接听、是否忙音、网络阻塞、呼叫被拒绝、以及一系列其他的回应。在理想情况下面，该呼叫会被正常接听。事实上，被接听的电话会被直接传递会发起电话的那个频道。而Asterisk将不会对其中的呼叫进行任何处理，知道呼叫双方都完成了确认（answer）。一旦如此，那么呼叫便开始了。

在一个channel的桥中，音频和信号事件，从一个channel 发送到另外一个频道，知道其中任何一个挂断。

在一个电话结束之后，挂断操作与之前的VoiceMail十分相似。但是主要不同是，这里涉及到了两个频道。这些channel会被实现的不同的挂断操作进行处理，之后再会关闭channel thread。

##总结
Asterisk 的架构已经有10多年的历史了。但是，其中的使用Asterisk dialplan进行灵活控制频道与呼叫的基本概念，仍然被广泛使用在了不断发展的工业上。一个Asterisk架构并不处理良好的地方，便是在多个服务器上完成扩展。而现在，Astrisk开发社区正在来发一个合作项目——Asterisk SCF（Scalable Communications Framework）。该项目将着重关注上面的扩展性问题。在接下来的几年里面，我们希望能够看到Asterisk、以及Asterisk SCF，能够在电话市场有着重大的份额，包括更多的安装量。
