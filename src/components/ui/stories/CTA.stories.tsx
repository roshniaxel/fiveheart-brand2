import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import CTA from "../CTA";

export default {
  title: "Components/CTA",
  component: CTA,
  argTypes: {
    color: { control: "color" }, // Adds a color picker in Storybook
  },
} as Meta<typeof CTA>;

const Template: StoryFn<typeof CTA> = (args) => <CTA {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  text: "Click Me",
  link: "#",
  color: "blue",
};
