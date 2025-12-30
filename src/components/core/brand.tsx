import Image from "next/image";
import Link from "next/link";

export default function Brand({
  redirectable = false,
}: {
  redirectable?: boolean;
}) {
  return (
    <div>
      <Link
        className="flex items-center justify-center space-x-1"
        href={redirectable ? "/" : "#"}
      >
        <Image
          alt="ReWriter"
          src="/logo.png"
          className="rounded-full border"
          width={30}
          height={30}
        />
        <span className="italic">Rewriter</span>
      </Link>
    </div>
  );
}
