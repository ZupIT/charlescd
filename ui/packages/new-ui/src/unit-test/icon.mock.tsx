import React from 'react';
import { Props as IconProps } from 'core/components/Icon';

jest.mock('core/components/Icon/helpers', () => {
  return {
    __esModule: true,
    dynamicImport: (
      name: string, setState: React.Dispatch<React.SetStateAction<string>>
    ) => {
      setState(name);
    }
  }
});

jest.mock('react-svg', () => {
  return {
    __esModule: true,
    ReactSVG: (props: IconProps) => {
      return (
        <div>
          <div>
            <svg {...props} />
          </div>
        </div>
      );
    }
  };
});
