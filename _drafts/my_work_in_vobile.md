|| 作者 || 黄盼盼 ||

## 线上运行（作者） ##
### OPM 3.2（包括DBPC） ###
 1. http://seals.vobile.cn/trac/Ranger/wiki/opm/3.2.0
 1. Vobile 的报警监控平台
 1. J2ee
 1. 版本稳定运行，目前需要修改的用户操作上的细节
 1. 目前已经移交给王林进行维护
### db_sync_lite ###
 1. http://seals.vobile.cn/trac/Ranger/wiki/opm/3.2.0/design_db_sync
 1. http://seals.vobile.cn/svn/Ranger/opm/trunk/src
 1. 部署在 WASU 与 EQX 之间，解决数据库无法进行主从同步的问题
 1. web.py + zmq (也有 rabbitmq 版本)
### EQX 线上 syslog 收集分析模块（Matrix 2.1 简化分支） ###
 1. http://seals.vobile.cn/trac/Ranger/wiki/Matrix/2.1.0.0， 参照其中的
     1. http://seals.vobile.cn/trac/Ranger/wiki/Matrix/2.1.0.0/deploy_4_auto_scale 用于部署
 1. http://seals.vobile.cn/svn/Ranger/matrix/trunk/src/matrix_get_server
 1. http://seals.vobile.cn/trac/Ranger/wiki/gla/log_dig_example
 1. 目前运行稳定，需要添加新的规则用于分析出更多的内容
 1. 已经交付谢子威进行维护
 1. [http://seals.vobile.cn/trac/Ranger/wiki/gla/1.0 蓝图]
 1. shell
### VUD 2.0 信息收集模块 ###
 1. http://seals.vobile.cn/trac/Ranger/wiki/vud/2.0
 1. 用于自动收集所有Vobile 安装的服务、版本、更新信息，同时用户可以上传脚本自定义收集的内容
 1. 运行稳定
 1. django
### VNS 1.0 ###
 1. http://seals.vobile.cn/trac/Ranger/wiki/vns/1.0
 1. 一个发送邮件、短信的对外服务（包括 API）
 1. 我负责完成架构，由王林负责开发，将在 OPM 4.0 中使用
 1. J2ee
## 开发阶段（作者） ##
### OPM 4.0 ###
 1. http://seals.vobile.cn/trac/Ranger/wiki/opm/4.0.0
 1. 完成了架构设计
 1. 完成了 backend 端的核心代码
 1. 目前项目是第一步阶段，由王林负责开发
### matrix 3.0 ###
 1. http://seals.vobile.cn/trac/Ranger/wiki/Matrix/3.0.0.0
 1. 还处于技术调研与验证阶段

## 维护者 ##
### TimeTracker ###
 1. 已经移交
 1. 192.168.1.28/TimeTracker
### livequery runner(vddb 5.4.0) ###
 1. 已经移交
 1. 简化了内部查询逻辑，使得支持新、老两套算法
### index manager(vddb 5.4.0) ###
 1. 已经移交
 1. core lib 作者，主要完成了机器的调度、base的allocate与merge，以及该模块的出错恢复模式与容错
 1. C++
 1. [http://seals.vobile.cn/trac/vdna/wiki/vddb5.4/design/index_manager_design_hpp 一个较好的设计，但是未被使用]
 1. svn: http://seals.vobile.cn/svn/vdna/branches/index_manager_5.4_2013_08_09
 1. [http://seals.vobile.cn/trac/vdna/wiki/vddb5.4/test/ec2 ec2 上的部署测试指南]
### cppdbi ###
 1. 一个 C++ 的数据库用 API，对此进行维护工作并且使其保持稳定
 1. C++
 1. 已经稳定
     1. svn: http://seals.vobile.cn/svn/CommonLib/vobile/trunk/cppdbi

## 尚未被使用的（作者） ##
### vlog4java、vlog4c、vlog4python ###
 1. 用于将日志输出到 syslog 中，并且按照规范组织起来
 1. java、C、python
 1. http://seals.vobile.cn/trac/CommonLib/wiki/vlog
### matrix 2.0 ###
 1. 一个云端的日志服务，包括了日志的收集、日志按照规则的分析、规则的定义、分析数据的二次处理、报表的展示等功能
 1. flume + hadoop (数据收集部分)、django (展示部分)
 1. http://seals.vobile.cn/trac/Ranger/wiki/Matrix/2.0.0.0
 ### 第三方软件库解决方案 ###
  1. 一个自动化的 debian 第三方与 Vobile 软件包的库更新、上传、维护解决方案
  1. [wiki:vud/2.0/third_party_software_library 第三方软件库解决方案]
  1. [wiki:vud/2.0/third_party_software_library_instructions 第三方软件库使用指南]
  1. shell
### ACR HCWS ###
 1. 停止维护
 1. 支持 c-10K 的一个 Web Service
 1. 使用 fastcgi 的版本较为稳定
 1. 使用 libevent、gevent 的版本使用了异步模式，已经终止开发
 1. C
 1. svn：http://seals.vobile.cn/svn/ACR/ACR/branches/hcws4acr
### VUD 1.0 ###
 1. 停止维护
 1. 一个 J2ee 框架的自动升级程序，需要用户的安装、升级脚本符合预订的规则
 1. http://seals.vobile.cn/trac/Ranger/wiki/vud/1.0

## 一些文档 ##
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20131022.0754 使用 mosh 代替 ssh 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20130906.0750 debian 6 python rabbitmq client案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20130710.0607 svn 升级到1.8的问题 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20130710.0152 当挫算法遇到海量数据 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20130627.0731 java 定义 syslog level 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20130625.1030 Missing field in record construction System.Process.Internals.create_group 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20130625.1005 cabal-install Not in scope: `catch' 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20130625.0952 ant 配置 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20130625.0947 Unknown or incorrect time zone 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20130424.0323 参数类型选择（code review） 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20130411.0826 每行代码不超过80个字符 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20130403.0647 不要使用 order by rand() 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20130228.0832 hive “org.datanucleus.store.rdbms.exceptions.MissingTableException:” 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20130226.0946 firefox 更新导致页面特效失效 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20130205.0346 vdna server - watchdog 启动失败 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20130129.1342 ec2 挂swap 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20130129.1327 ec2 修改overcommit配置 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20130126.0707 启动多个 gearman 来分担压力 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20130112.0837 使用nginx反向代理 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20130110.1207 一个包装烂了怎么办？案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20121225.0232 使用valgrind分析内存 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20121222.0641 同步系统时间 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20121206.0631 使用 indent 来格式化规范风格的代码 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20121123.1218 protolbuffer 速成手册 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20121123.0335 C++ 11 可变参数模板 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20121119.1248 mysql_stmt_fetch_column() 使用 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20121116.1103 sharp-bang 必须在第一行 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20121108.0802 Gunicorn 运行 WSGI 服务 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20121106.0550 打包去除版本控制文件 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20121031.0559 “CST 到底是什么?” 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20121030.0249 nginx + WSGI 部署 django 服务 案例分析 (含新手 Vobile Django 工程模板) ]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20121026.0200 Largest Submatrix of All 1's 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20121024.0820 opm 中 spring 初始化死锁案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20121024.0311 opm web报警响应时间溢出案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20121008.1034 opm网页载入缓慢案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20120914.1037 dbpc Read Time Out导致误报 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20120912.1039 第三方库安装案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20120912.0944 dbpc局限性与RoadMap案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20120912.0939 opm 数据迁移案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20120828.0853 S2SH Log4j无效 案例分析]
 1. [http://seals.vobile.cn/trac/DevpManagement/blog/huang_panpan-20120828.0737 opm 3 内存泄漏问题案例分析]
 1. [http://seals.vobile.cn/trac/Ranger/wiki/vud/explore_doc vud初期探索报告]
 1. [http://seals.vobile.cn/trac/Ranger/blog/ding_honghui-20120905.0927 VUD 的阶段性目标]
 1. [http://seals.vobile.cn/trac/Ranger/blog/huang_panpan-20120912.0602 手把手教你建立PPA]
 1. [wiki:vud/2.0/third_party_software_library 第三方软件库解决方案]
 1. [wiki:vud/2.0/third_party_software_library_instructions 第三方软件库使用指南]
 1. [wiki:Matrix/3.0.0.0/mongodb_vs_hive mongodb与hive的简单比较]
 1. [http://seals.vobile.cn/trac/Ranger/blog/huang_panpan-20121024.0211 基于电影相似度的推荐系统算法]
 1. [http://seals.vobile.cn/trac/Ranger/blog/huang_panpan-20120924.0556 使用expect自动输入密码 ]
 1. [http://seals.vobile.cn/trac/Ranger/blog/huang_panpan-20120911.1041 现有dbpc的分析与展望]
 1. [http://seals.vobile.cn/trac/Ranger/blog/huang_panpan-20120828.0622 S2SH tomcat6 日志控制]
 1. [http://seals.vobile.cn/trac/Ranger/blog/huang_panpan-20120828.0636 opm 3 内存泄漏问题分析]
 1. [http://seals.vobile.cn/trac/Ranger/blog/huang_panpan-20120827.0750 trap in bash]
 1. [http://seals.vobile.cn/trac/Ranger/blog/huang_panpan-20120821.0358 sso方案]
 1. [http://seals.vobile.cn/trac/Ranger/blog/huang_panpan-20120817.0144 答《CC Case 编写中发现的一些问题》]
 1. [http://seals.vobile.cn/trac/Ranger/blog/huang_panpan-20120815.0535 struts2 url参数中文获取]

## 总计 ##

代码共'''97289'''行，文档共'''357'''篇，其中'''技术文档 56 篇，设计文档 38 篇，管理文档 58 篇'''，项目文档 205 篇（包括项目的组织、安排、发布等等）

|| 月份 || 代码行数 || 月份 || 代码行数 || 月份 || 代码行数 ||
||  2013-09 ||  1445    || 2013-08 ||  1672 ||  2013-07 ||  617 ||
||  2013-06 ||  10203   ||  2013-05 ||  5829    || 2013-04 ||  2016    ||
||  2013-03 ||  27289   || 2013-02 ||  5527    || 2013-01 ||  2424    ||
||  2012-12 ||  10110   ||  2012-11 ||  6731    ||  2012-10 ||  1385    ||
||  2012-09 ||  7905    ||  2012-08 ||  1056    ||  2012-07 ||  7905    ||
||  2012-06 ||  102 ||  2012-05 ||  320 ||  2012-04 ||  1023    ||
||  2012-03 ||  0   ||  2012-02 ||  12  ||  2012-01 ||  1794    ||
||  2011-12 ||  188 ||  2011-11 ||  868 ||  2011-10 ||  868 ||
||  TOTAL   ||  97289   ||
