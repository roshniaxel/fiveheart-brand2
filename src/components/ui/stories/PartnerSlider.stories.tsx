import type { Meta, StoryObj } from "@storybook/react";
import PartnerSlider from "../PartnerSlider";

const meta: Meta<typeof PartnerSlider> = {
  title: "Components/PartnerSlider",
  component: PartnerSlider,
};

export default meta;

type Story = StoryObj<typeof PartnerSlider>;

export const Default: Story = {
  render: () => <PartnerSlider />,
};
