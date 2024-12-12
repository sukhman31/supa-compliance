import DataCards from "../components/Datacards";

async function fetchUserData(token: string) {
  try {
    const response = await fetch(`http://localhost:54321/extract-data?token=${token}`);

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export default async function AuthRedirectPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  // Await the searchParams
  const params = await searchParams;
  const token = params.token;

  if (token) {
    // Set the token in an HTTP-only cookie for enhanced security
    const userData = await fetchUserData(token);

    console.log(userData)

    return (
      <main className=" w-screen">
        <DataCards data={userData} />
      </main>
    );
  }
  
}