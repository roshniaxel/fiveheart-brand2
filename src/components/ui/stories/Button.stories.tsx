import { Meta, StoryFn } from "@storybook/react";
import Button from "../Button";

export default {
  title: "Components/Button",
  component: Button,
  argTypes: {
    children: { control: "text" }, // ✅ Use 'children' instead of 'label'
    variant: { control: "radio", options: ["default", "outline"] },
    size: { control: "radio", options: ["default", "lg"] },
    className: { control: "text" },
  },
} as Meta<typeof Button>;

const Template: StoryFn<typeof Button> = (args) => <Button {...args} />;

export const Vijfhart = Template.bind({});
Vijfhart.args = {
  children: "Bekijk onze verjaardags-pagina", // ✅ Pass children instead of label
  variant: "default",
  size: "default",
};

export const Secondary = Template.bind({});
Secondary.args = {
  children: "Learn More",
  variant: "outline",
  size: "lg",
};
