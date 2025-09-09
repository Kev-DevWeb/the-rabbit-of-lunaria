import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/confirmation/error', request.url));
  }

  try {
    const bookingsRef = adminDb.collection("bookings");
    const q = bookingsRef.where("confirmToken", "==", token);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      console.error("No appointment found with the provided confirmation token.");
      return NextResponse.redirect(new URL('/confirmation/error', request.url));
    }

    const appointmentDoc = querySnapshot.docs[0];
    const appointmentRef = appointmentDoc.ref;
    const appointmentData = appointmentDoc.data();

    if (appointmentData.status === 'confirmed') {
      return NextResponse.redirect(new URL('/confirmation/confirmed', request.url));
    }

    await appointmentRef.update({
      status: "confirmed",
    });

    const appBaseUrl = new URL(request.url).origin;

    // Send confirmation email to the user
    await fetch(`${appBaseUrl}/api/send-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: appointmentData.email,
          readingTitle: appointmentData.readingTitle,
          date: appointmentData.date,
          time: appointmentData.time,
        }),
      });

    return NextResponse.redirect(new URL('/confirmation/confirmed', request.url));

  } catch (error) {
    console.error("Error confirming appointment:", error);
    return NextResponse.redirect(new URL('/confirmation/error', request.url));
  }
}
