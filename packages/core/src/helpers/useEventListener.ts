import { MaybeRefOrGetter, onBeforeUnmount, toValue, watch } from 'vue';

export function useEventListener(
  targetRef: MaybeRefOrGetter<HTMLElement | undefined>,
  event: string,
  listener: EventListener,
) {
  function cleanup(el: HTMLElement) {
    el.removeEventListener(event, listener);
  }

  const stop = watch(
    () => toValue(targetRef),
    (target, oldTarget) => {
      if (oldTarget && oldTarget !== target) {
        cleanup(oldTarget);
      }

      if (target) {
        target.addEventListener(event, listener);
      }
    },
  );

  onBeforeUnmount(() => {
    const target = toValue(targetRef);
    if (target) {
      cleanup(target);
    }

    stop();
  });
}
