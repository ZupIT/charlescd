import React from 'react';
import PanelContent, { Props as ContentProps } from './Content';
import PanelSection, { Props as SectionProps } from './Section';

const Panel = {
  Content: (props: ContentProps) => <PanelContent {...props} />,
  Section: (props: SectionProps) => <PanelSection {...props} />
};

export default Panel;
