import type { ReactNode } from "react";

type DesType = {
  title: string;
  description: string;
  img: ReactNode;
};

type Props = {
  item: DesType;
};

function HomeDescriptionItem({ item }: Props) {
  return (
    <div className="flex gap-5 w-1/3 shadow-lg rounded-2xl p-5 items-center">
      {item.img}
      <div>
        <div className="font-semibold mb-2">{item.title}</div>
        <div className="text-base">{item.description}</div>
      </div>
    </div>
  );
}

export default HomeDescriptionItem;
