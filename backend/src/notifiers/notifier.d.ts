export default interface Notifier<T> {
    public send(data: T): void;
}