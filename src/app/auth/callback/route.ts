import { NextRequest, NextResponse } from 'next/server';
import { UsersDM } from '@/domain-models/UsersDM';
import { UserRepository } from '@/repository/UserRepository';

export async function POST(req: NextRequest) {
    const { username, password } = await req.json();

    try {
        const user: UsersDM | null = await UserRepository.getUserByEmail(username);

        if (!user) {
            console.log("User not found");
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Direct plain-text comparison (INSECURE)
        if (user.password !== password) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        return NextResponse.json({
            user_name: user.name,
            user_id: user.id,
            email: user.email,
        });

    } catch (error) {
        console.error("Error in POST handler:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
