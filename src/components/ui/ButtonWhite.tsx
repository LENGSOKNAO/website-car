import { Link } from "react-router-dom";

function ButtonWhite({ to, children }: { to: string; children: string }) {
  const btnBaseClass =
    "px-7 py-3 text-xs md:text-sm transition-all duration-300 active:scale-95";

  return (
    <Link
      to={to}
      className={`${btnBaseClass} border text-center rounded-sm border-white/20 font-medium text-white hover:text-white/70 hover:border-white/40 backdrop-blur-sm`}
    >
      {children}
    </Link>
  );
}

export default ButtonWhite;
