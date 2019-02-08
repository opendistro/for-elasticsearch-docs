---
layout: default
title: Metrics Reference
parent: Performance Analyzer
nav_order: 3
---

# Metrics Reference

This page contains all Performance Analyzer metrics. All metrics support the `avg`, `sum`, `min`, and `max` aggregations, although certain metrics only measure one thing, making the choice of aggregation irrelevant.

The list is extensive. We recommend Ctrl + F to find individual metrics.
{: .tip }

<table>
  <thead style="text-align: left">
    <tr>
      <th>Metric</th>
      <th>Dimensions</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>CPU_Utilization
      </td>
      <td rowspan="16">ShardID, IndexName, Operation, ShardRole
      </td>
      <td>CPU usage ratio. CPU time (in milliseconds) used by the associated thread(s) in the past five seconds, divided by 5000 milliseconds.
      </td>
    </tr>
    <tr>
      <td>Paging_MajfltRate
      </td>
      <td>The number of major faults per second in the past five seconds. A major fault requires the process to load a memory page from disk.
      </td>
    </tr>
    <tr>
      <td>Paging_MinfltRate
      </td>
      <td>The number of minor faults per second in the past five seconds. A minor fault does not requires the process to load a memory page from disk.
      </td>
    </tr>
    <tr>
      <td>Paging_RSS
      </td>
      <td>The number of pages the process has in real memory---the pages that count towards text, data, or stack space. This number does not include pages that have not been demand-loaded in or swapped out.
      </td>
    </tr>
    <tr>
      <td>Sched_Runtime
      </td>
      <td>Time (seconds) spent executing on the CPU per context switch.
      </td>
    </tr>
    <tr>
      <td>Sched_Waittime
      </td>
      <td>Time (seconds) spent waiting on a run queue per context switch.
      </td>
    </tr>
    <tr>
      <td>Sched_CtxRate
      </td>
      <td>Number of times run on the CPU per second in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Heap_AllocRate
      </td>
      <td>An approximation of the heap memory allocated, in bytes, per second in the past five seconds
      </td>
    </tr>
    <tr>
      <td>IO_ReadThroughtput
      </td>
      <td>Number of bytes read per second in the last five seconds.
      </td>
    </tr>
    <tr>
      <td>IO_WriteThroughput
      </td>
      <td>Number of bytes written per second in the last five seconds.
      </td>
    </tr>
    <tr>
      <td>IO_TotThroughput
      </td>
      <td>Number of bytes read or written per second in the last five seconds.
      </td>
    </tr>
    <tr>
      <td>IO_ReadSyscallRate
      </td>
      <td>Read system calls per second in the last five seconds.
      </td>
    </tr>
    <tr>
      <td>IO_WriteSyscallRate
      </td>
      <td>Write system calls per second in the last five seconds.
      </td>
    </tr>
    <tr>
      <td>IO_TotalSyscallRate
      </td>
      <td>Read and write system calls per second in the last five seconds.
      </td>
    </tr>
    <tr>
      <td>Thread_Blocked_Time
      </td>
      <td>Average time (seconds) that the associated thread(s) blocked to enter or reenter a monitor.
      </td>
    </tr>
    <tr>
      <td>Thread_Blocked_Event
      </td>
      <td>The total number of times that the associated thread(s) blocked to enter or reenter a monitor (i.e. the number of times a thread has been in the blocked state).
      </td>
    </tr>
    <tr>
      <td>Indexing_ThrottleTime
      </td>
      <td rowspan="29">ShardID, IndexName
      </td>
      <td>Time (milliseconds) that the index has been under merge throttling control in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Cache_Query_Hit
      </td>
      <td>The number of successful lookups in the query cache in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Cache_Query_Miss
      </td>
      <td>The number of lookups in the query cache that failed to retrieve a `DocIdSet` in the past five seconds. `DocIdSet` is a set of document IDs in Lucene.
      </td>
    </tr>
    <tr>
      <td>Cache_Query_Size
      </td>
      <td>Query cache memory size in bytes.
      </td>
    </tr>
    <tr>
      <td>Cache_FieldData_Eviction
      </td>
      <td>The number of times Elasticsearch has evicted data from the fielddata heap space (occurs when the heap space is full) in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Cache_FieldData_Size
      </td>
      <td>Fielddata memory size in bytes.
      </td>
    </tr>
    <tr>
      <td>Cache_Request_Hit
      </td>
      <td>The number of successful lookups in the shard request cache in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Cache_Request_Miss
      </td>
      <td>The number of lookups in the request cache that failed to retrieve the results of search requests in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Cache_Request_Eviction
      </td>
      <td>The number of times Elasticsearch evicts data from shard request cache (occurs when the request cache is full) in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Cache_Request_Size
      </td>
      <td>Shard request cache memory size in bytes.
      </td>
    </tr>
    <tr>
      <td>Refresh_Event
      </td>
      <td>The total number of refreshes executed in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Refresh_Time
      </td>
      <td>The total time (milliseconds) spent executing refreshes in the past five seconds
      </td>
    </tr>
    <tr>
      <td>Flush_Event
      </td>
      <td>The total number of flushes executed in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Flush_Time
      </td>
      <td>The total time (milliseconds) spent executing flushes in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Merge_Event
      </td>
      <td>The total number of merges executed in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Merge_Time
      </td>
      <td>The total time (milliseconds) spent executing merges in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Merge_CurrentEvent
      </td>
      <td>The current number of merges executing.
      </td>
    </tr>
    <tr>
      <td>Indexing_Buffer
      </td>
      <td>Index buffer memory size in bytes.
      </td>
    </tr>
    <tr>
      <td>Segments_Total
      </td>
      <td>The number of segments.
      </td>
    </tr>
    <tr>
      <td>Segments_Memory
      </td>
      <td>Estimated memory usage of segments in bytes.
      </td>
    </tr>
    <tr>
      <td>Terms_Memory
      </td>
      <td>Estimated memory usage of terms dictionaries in bytes.
      </td>
    </tr>
    <tr>
      <td>StoredFields_Memory
      </td>
      <td>Estimated memory usage of stored fields in bytes.
      </td>
    </tr>
    <tr>
      <td>TermVectors_Memory
      </td>
      <td>Estimated memory usage of term vectors in bytes.
      </td>
    </tr>
    <tr>
      <td>Norms_Memory
      </td>
      <td>Estimated memory usage of norms (normalization factors) in bytes.
      </td>
    </tr>
    <tr>
      <td>Points_Memory
      </td>
      <td>Estimated memory usage of points in bytes.
      </td>
    </tr>
    <tr>
      <td>DocValues_Memory
      </td>
      <td>Estimated memory usage of doc values in bytes.
      </td>
    </tr>
    <tr>
      <td>IndexWriter_Memory
      </td>
      <td>Estimated memory usage by the index writer in bytes.
      </td>
    </tr>
    <tr>
      <td>Bitset_Memory
      </td>
      <td>Estimated memory usage for the cached bit sets in bytes.
      </td>
    </tr>
    <tr>
      <td>VersionMap_Memory
      </td>
      <td>Estimated memory usage of the version map in bytes.
      </td>
    </tr>
    <tr>
      <td>Latency
      </td>
      <td>Operation, Exception, Indices, HTTPRespCode, ShardID, IndexName, ShardRole
      </td>
      <td>Latency (milliseconds) of a request.
      </td>
    </tr>
    <tr>
      <td>GC_Collection_Event
      </td>
      <td rowspan="6">MemType
      </td>
      <td>The number of garbage collections that have occurred in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>GC_Collection_Time
      </td>
      <td>The approximate accumulated time (milliseconds) of all garbage collections that have occurred in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Heap_Committed
      </td>
      <td>The amount of memory (bytes) that is committed for the JVM to use.
      </td>
    </tr>
    <tr>
      <td>Heap_Init
      </td>
      <td>The amount of memory (bytes) that the JVM initially requests from the operating system for memory management.
      </td>
    </tr>
    <tr>
      <td>Heap_Max
      </td>
      <td>The maximum amount of memory (bytes) that can be used for memory management.
      </td>
    </tr>
    <tr>
      <td>Heap_Used
      </td>
      <td>The amount of used memory in bytes.
      </td>
    </tr>
    <tr>
      <td>Disk_Utilization
      </td>
      <td rowspan="3">DiskName
      </td>
      <td>Disk utilization rate: percentage of disk time spent reading and writing by the Elasticsearch process in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Disk_WaitTime
      </td>
      <td>Average duration (milliseconds) of read and write operations in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Disk_ServiceRate
      </td>
      <td>Service rate: MB read or written per second in the past five seconds. This metric assumes that each disk sector stores 512 bytes.
      </td>
    </tr>
    <tr>
      <td>Net_TCP_NumFlows
      </td>
      <td rowspan="6">DestAddr
      </td>
      <td>Number of sample collected. Performance Analyzer collects one sample every five seconds.
      </td>
    </tr>
    <tr>
      <td>Net_TCP_TxQ
      </td>
      <td>Average number of TCP packets in the send buffer.
      </td>
    </tr>
    <tr>
      <td>Net_TCP_RxQ
      </td>
      <td>Average number of TCP packets in the receive buffer.
      </td>
    </tr>
    <tr>
      <td>Net_TCP_Lost
      </td>
      <td>Average number of unrecovered recurring timeouts. This number is reset when the recovery finishes or `SND.UNA` is advanced. `SND.UNA` is the sequence number of the first byte of data that has been sent, but not yet acknowledged.
      </td>
    </tr>
    <tr>
      <td>Net_TCP_SendCWND
      </td>
      <td>Average size (bytes) of the sending congestion window.
      </td>
    </tr>
    <tr>
      <td>Net_TCP_SSThresh
      </td>
      <td>Average size (bytes) of the slow start size threshold.
      </td>
    </tr>
    <tr>
      <td>Net_PacketRate4
      </td>
      <td rowspan="5">Direction
      </td>
      <td>The total number of IPv4 datagrams transmitted/received from/by interfaces per second, including those transmitted or received in error
      </td>
    </tr>
    <tr>
      <td>Net_PacketDropRate4
      </td>
      <td>The total number of IPv4 datagrams transmitted or received in error per second.
      </td>
    </tr>
    <tr>
      <td>Net_PacketRate6
      </td>
      <td>The total number of IPv6 datagrams transmitted or received from or by interfaces per second, including those transmitted or received in error.
      </td>
    </tr>
    <tr>
      <td>Net_PacketDropRate6
      </td>
      <td>The total number of IPv6 datagrams transmitted or received in error per second.
      </td>
    </tr>
    <tr>
      <td>Net_Throughput
      </td>
      <td>The number of bytes of data transmitted or received per second by all network interfaces.
      </td>
    </tr>
    <tr>
      <td>ThreadPool_QueueSize
      </td>
      <td rowspan="4">ThreadPoolType
      </td>
      <td>The size of the task queue.
      </td>
    </tr>
    <tr>
      <td>ThreadPool_RejectedReqs
      </td>
      <td>The number of rejected executions.
      </td>
    </tr>
    <tr>
      <td>ThreadPool_TotalThreads
      </td>
      <td>The current number of threads in the pool.
      </td>
    </tr>
    <tr>
      <td>ThreadPool_ActiveThreads
      </td>
      <td>The approximate number of threads that are actively executing tasks.
      </td>
    </tr>
    <tr>
      <td>Master_PendingQueueSize
      </td>
      <td>N/A
      </td>
      <td>The current number of pending tasks in the cluster state update thread. Each node has a cluster state update thread that submits cluster state update tasks (create index, update mapping, allocate shard, fail shard, etc.).
      </td>
    </tr>
    <tr>
      <td>HTTP_RequestDocs
      </td>
      <td rowspan="2">Operation, Exception, Indices, HTTPRespCode
      </td>
      <td>The number of items in the request (only for `_bulk` request type).
      </td>
    </tr>
    <tr>
      <td>HTTP_TotalRequests
      </td>
      <td>The number of finished requests in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>CB_EstimatedSize
      </td>
      <td rowspan="3">CBType
      </td>
      <td>The current number of estimated bytes.
      </td>
    </tr>
    <tr>
      <td>CB_TrippedEvents
      </td>
      <td>The number of times the circuit breaker has tripped.
      </td>
    </tr>
    <tr>
      <td>CB_ConfiguredSize
      </td>
      <td>The limit (bytes) for how much memory operations can use.
      </td>
    </tr>
  </tbody>
</table>
