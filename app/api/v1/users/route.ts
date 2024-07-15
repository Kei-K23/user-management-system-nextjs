import { insertUser } from "@/services/user";

export async function POST(request: Request) {
    const jsonData = await request.json();
    const username = jsonData.username;
    const email = jsonData.email;
    const phone = jsonData.phone;
    const password = jsonData.password;

    // Check validation for form data
    if (!username || !email || !phone || !password) {
        return Response.json({ error: 'Invalid form data' }, { status: 400 });
    }

    // Insert user to your database here
    const newUser = await insertUser({
        username: username,
        email,
        phone,
        password,
    })

    return Response.json({ data: newUser }, { status: 201 });
}