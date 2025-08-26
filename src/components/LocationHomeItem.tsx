type HomeLocationItem = {
  img: string;
  name: string;
};

function LocationHomeItem(item: HomeLocationItem) {
  return (
    <div className=" flex flex-col items-center cursor-pointer transition-shadow duration-300 hover:shadow-lg md:h-60 h-30 rounded-2xl flex-shrink-0 ">
      <img
        className="md:w-66 md:h-55 w-38 h-30 rounded-md object-cover"
        src={item.img}
      />
      <div className="md:text-sm text-[12px] font-semibold flex items-center text-center justify-center h-10 w-full">
        {item.name}
      </div>
    </div>
  );
}

export default LocationHomeItem;
