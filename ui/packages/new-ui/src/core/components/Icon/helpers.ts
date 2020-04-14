/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export const dynamicImport = async (
  name: string,
  setState: React.Dispatch<React.SetStateAction<string>>
) => {
  const svgData = await import(`core/assets/svg/${name}.svg`);
  setState(svgData?.default);
};
