import Header from "@/components/landing/header";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="max-w-md mx-auto p-4 min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="space-y-2 mb-6">
          <p className="text-accent-foreground/90">
            This platform is for <b>Writers</b> to host there blogs or save
            journals without any setup just create a vault and start writing
            rest we will do.
          </p>
          <p>
            Integrate{" "}
            <b>
              <i>Rewriter</i>
            </b>{" "}
            with <span className="text-purple-600 underline">Obsidian</span>{" "}
            throught plugin and you are good to go. No heavy setup. Only manage
            online presence or backups here.
          </p>
        </section>
        <Separator />
        <section className="flex items-center flex-col space-y-3 mt-2 ">
          Stay tune! launching soon.
        </section>
      </main>

      <footer className="text-sm text-center">
        &copy; 2026 Rewriter, a P8labs Product.
      </footer>
    </div>
  );
}
