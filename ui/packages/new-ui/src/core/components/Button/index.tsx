import React from 'react';
import { Props as IIconProps } from 'core/components/Icon';
import ButtonIcon, {
  Props as ButtonIconProps
} from 'core/components/Button/Icon';
import ButtonDefault, {
  Props as ButtonDefaultProps
} from 'core/components/Button/Default';

const Button = {
  Icon: (props: ButtonIconProps & IIconProps) => <ButtonIcon {...props} />,
  Default: (props: ButtonDefaultProps) => <ButtonDefault {...props} />
};

export default Button;
