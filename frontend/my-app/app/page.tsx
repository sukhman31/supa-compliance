import { Button } from "@nextui-org/button";

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-8xl font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100">Supabase Compliance Demo</h1>
      <h2 className="m-12">Get compliant today. Figure out where you are going wrong.</h2>
      <p>
      <Button className="m-24">
        <a href="http://localhost:54321/authorize">Let's begin!</a>
      </Button>
      </p>
    </div>
  )
}

