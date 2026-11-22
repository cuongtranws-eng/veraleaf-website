import * as migration_20261122_134439_initial from './20261122_134439_initial';
import * as migration_20261122_141259_brand_fields from './20261122_141259_brand_fields';
import * as migration_20261122_151232_second_phone from './20261122_151232_second_phone';

export const migrations = [
  {
    up: migration_20261122_134439_initial.up,
    down: migration_20261122_134439_initial.down,
    name: '20261122_134439_initial',
  },
  {
    up: migration_20261122_141259_brand_fields.up,
    down: migration_20261122_141259_brand_fields.down,
    name: '20261122_141259_brand_fields',
  },
  {
    up: migration_20261122_151232_second_phone.up,
    down: migration_20261122_151232_second_phone.down,
    name: '20261122_151232_second_phone'
  },
];
