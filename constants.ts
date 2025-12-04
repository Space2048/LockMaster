import { LockCategory, LockDefinition } from './types';

export const LOCK_DATA: LockDefinition[] = [
  {
    id: 'mutex',
    name: '互斥锁 (Mutex)',
    category: LockCategory.PESSIMISTIC,
    shortDesc: '最基本的锁，确保同一时间只有一个线程访问资源。',
    fullDesc: '互斥锁（Mutual Exclusion Object）是一种用于多线程编程中，防止两条线程同时对同一公共资源（比如全局变量）进行读写的机制。当一个线程锁定了一个互斥锁，其他试图锁定该互斥锁的线程会被阻塞（Blocked），直到锁被释放。',
    pros: ['实现简单，使用广泛', '保证数据强一致性', '适用于持有锁时间较长的场景'],
    cons: ['线程阻塞和唤醒涉及内核态切换，开销大', '可能导致死锁', '无法区分读写操作，并发度低'],
    simulationType: 'MUTEX'
  },
  {
    id: 'spinlock',
    name: '自旋锁 (Spinlock)',
    category: LockCategory.PESSIMISTIC,
    shortDesc: '线程在获取锁失败时不会休眠，而是循环检测锁状态。',
    fullDesc: '自旋锁是指当一个线程在获取锁的时候，如果锁已经被其它线程获取，那么该线程将循环等待，然后不断的判断锁是否能够被成功获取，直到获取到锁才会退出循环。它避免了上下文切换的开销。',
    pros: ['避免了线程上下文切换的开销', '适用于锁持有时间非常短的场景'],
    cons: ['如果持有锁时间长，会浪费大量 CPU', '在单核处理器上通常没有意义', '可能导致线程饥饿'],
    simulationType: 'SPIN'
  },
  {
    id: 'rwlock',
    name: '读写锁 (Read-Write Lock)',
    category: LockCategory.ADVANCED,
    shortDesc: '允许多个读者同时访问，但写者独占。',
    fullDesc: '读写锁维护了一对锁，一个读锁和一个写锁。通过分离读锁和写锁，使得并发性相比一般的互斥锁有了很大提升。在没有写线程的情况下，多个读线程可以同时持有读锁。',
    pros: ['极大提高了读多写少场景的并发性能', '读操作互不阻塞'],
    cons: ['实现较为复杂', '写线程可能会遭受饥饿（取决于公平策略）'],
    simulationType: 'READ_WRITE'
  },
  {
    id: 'optimistic',
    name: '乐观锁 (Optimistic Lock)',
    category: LockCategory.OPTIMISTIC,
    shortDesc: '假设不会发生冲突，只在更新时检查是否被修改。',
    fullDesc: '乐观锁顾名思义，就是很乐观，每次去拿数据的时候都认为别人不会修改，所以不会上锁，但是在更新的时候会判断一下在此期间别人有没有去更新这个数据。通常使用版本号机制或 CAS (Compare And Swap) 算法实现。',
    pros: ['吞吐量高', '无锁编程，没有死锁风险'],
    cons: ['在高并发写场景下，重试率高，浪费 CPU', 'ABA 问题 (CAS)', '只能保证一个共享变量的原子操作'],
    simulationType: 'MUTEX' // Visualization simplifies to basic exclusive update for visual clarity
  },
  {
    id: 'reentrant',
    name: '可重入锁 (Reentrant Lock)',
    category: LockCategory.ADVANCED,
    shortDesc: '允许同一个线程多次获取同一把锁，避免死锁。',
    fullDesc: '可重入锁，也叫做递归锁，指的是同一线程 外层函数获得锁之后 ，内层递归函数仍然有获取该锁的代码，但不受影响。Java 的 ReentrantLock 和 synchronized 都是可重入锁。',
    pros: ['避免了递归调用或嵌套调用时的死锁', '使用灵活'],
    cons: ['需要手动释放对应次数的锁 (ReentrantLock)'],
    simulationType: 'MUTEX'
  }
];

export const LANGUAGES = ['Java', 'Python', 'Go', 'C++', 'JavaScript'];
