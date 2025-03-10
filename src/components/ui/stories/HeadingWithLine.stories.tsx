import { Meta, StoryFn } from "@storybook/react";
import HeadingWithLine from "../HeadingWithLine";

export default {
  title: "Components/HeadingWithLine",
  component: HeadingWithLine,
  argTypes: {
    text: { control: "text" },
    color: { control: "color" },
    lineColor: { control: "color" },
  },
} as Meta<typeof HeadingWithLine>;

const Template: StoryFn<typeof HeadingWithLine> = (args) => <HeadingWithLine {...args} />;

export const VijfhartStyle = Template.bind({});
VijfhartStyle.args = {
  text: "Vijfhart 40 jaar",
  color: "#1A1A1A", // Dark text like Vijfhart
  lineColor: "#E30613", // Red underline
};

export const CustomStyle = Template.bind({});
CustomStyle.args = {
  text: "Custom Heading",
  color: "#0056b3", // Blue text
  lineColor: "#FFD700", // Gold underline
};
