import { shallowRef } from 'vue';
import { uniqId } from './utils/common';

interface Config {
  idGenerator: (prefix: string) => string;
}

const currentConfig = shallowRef<Config>({
  idGenerator: uniqId,
});

export function configure(config: Config) {
  return config;
}

export function getConfig() {
  return currentConfig.value;
}
