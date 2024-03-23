interface Env {
	WORKERTEST_QUEUE: Queue<QueueMessage>;
}
interface QueueMessage {
	key: string;
	value: string;
}
