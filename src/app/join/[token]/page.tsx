import JoinWorkspace from "@/components/join-workspace";

export default async function JoinPage({ params }: { params: Promise<{ token: string }> }){
    const {token} = await params
    return <JoinWorkspace token={token} />;
}
