import { UsersDataTable } from "../components/UsersDataTable";


export default function UsersPage() {
    return (
        <main className="flex flex-col items-center gap-4">
            <h1 className="w-full text-2xl font-semibold">Usuarios</h1>
            <section className="flex h-full w-full flex-col justify-between rounded-2xl bg-white px-4 shadow-md">
                <UsersDataTable />
            </section>
        </main>
    );
}