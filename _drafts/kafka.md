== kafka ==
[[TOC]]

## 简介 ##

这是一个分布式、分区式、多副本的提交日志服务。它使用了一套独一无二的设计来提供了一个消息系统的功能。

首先，我们需要熟悉下最基本的消息传递术语：

1. kafka 将消息在不同的被称作是 topic 的类别中进行维护。
1. 那些将消息发布给 kafka topic 的进程，我们称之为 producers。
1. 那些订阅消息，并且给订阅的消息反馈的进程，我们成为 consumers。
1. kafka 作为一个 cluster（集群）的形式运作，其中包括的一个或者多个被称作是 broker 的服务器。

在这些客户端和服务器段的传输使用了简单、高性能并且不分语言的 TCP 协议。