import { NavLink } from "react-router-dom";

interface Props {
  title: string;
  imageUrl: string;
  linkTo: string;
}

export default function CategoryCard({ title, imageUrl, linkTo }: Props) {
  return (
    <NavLink
      to={linkTo}
      className="group block rounded-lg overflow-hidden shadow-lg relative"
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all" />
      <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold">
        {title}
      </h3>
    </NavLink>
  );
}
