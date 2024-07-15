import { insertUser } from "@/services/user";

export async function POST(request: Request) {
    const formData = await request.formData();
    const username = formData.get('username')?.toString();
    const email = formData.get('email')?.toString();
    const phone = formData.get('phone')?.toString();
    const password = formData.get('password')?.toString();

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