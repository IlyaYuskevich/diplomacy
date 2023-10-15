import { Button } from "components/index.ts";


export default function SignInForm() {
    return (
      <div class="items-stretch min-w-0">
        <div class="flex justify-center">
          <h2 class="my-4">Sign In</h2>
        </div>
  
        <form method="post" class="flex flex-col space-y-4 min-w-0">
          <Button autofocus type="email" name="email" />
          <Button type="password" name="password" />
  
          <Button type="submit" formAction="/api/sign-in" class="!mt-8">
            Sign In
          </Button>
  
        </form>
      </div>
    );
  }