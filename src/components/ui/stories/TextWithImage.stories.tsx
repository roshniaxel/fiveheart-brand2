import { Meta, StoryFn } from "@storybook/react";
import TextWithImage, { TextWithImageProps } from "../TextWithImage";

export default {
  title: "Components/TextWithImage",
  component: TextWithImage,
  argTypes: {
    imageUrl: { control: "text" },
    imageAlt: { control: "text" },
    title: { control: "text" },
    text: { control: "text" },
    imagePosition: { control: { type: "select", options: ["left", "right"] } },
    button: { control: "object" },
  },
} as Meta<TextWithImageProps>;

const Template: StoryFn<TextWithImageProps> = (args: TextWithImageProps) => <TextWithImage {...args} />;

export const Default = Template.bind({});
Default.args = {
  imageUrl: "/images/text-image.gif",
  imageAlt: "Example Image",
  title: "Vijfhart 40 jaar",
  text: "Wij zijn jarig! 🎈 40 jaar geleden gaven we onze eerste IT-cursus.",
  imagePosition: "left",
  button: {
    text: "Learn More",
    href: "#",
  },
};

export const ImageOnRight = Template.bind({});
ImageOnRight.args = {
  ...Default.args,
  imagePosition: "right",
};
