import { cookies } from "next/headers";
import { Button, Container, InputField, Row, Stack } from "@yakad/ui";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import BackButton from "../../../(components)/BackButton";

async function addAyah(surah_uuid: string, formData: FormData) {
    const sajdeh = formData.get("sajdeh")?.toString()!;

    const ayah = {
        surah_uuid: surah_uuid,
        sajdeh: sajdeh === "none" ? null : sajdeh,
        text: formData.get("text")?.toString()!,
    };

    const response = await fetch(`${process.env.API_URL}/ayah`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: cookies().get("token")?.value || "none",
        },
        body: JSON.stringify(ayah),
    });

    if (response.status !== 200) {
        throw new Error(`You can't add this ayah!, ${await response.text()}`);
    }
}

export default async function Page({ searchParams }: { searchParams: { continue: string, surah_uuid: string } }) {
    const url = decodeURIComponent(searchParams.continue);
    const urlWithoutParams = url.split("?")[0];

    return (
        <Container maxWidth="sm">
            <h1>Add Ayah</h1>

            <form
                style={{ width: "100%" }}
                action={async (formData) => {
                    "use server";
                    await addAyah(searchParams.surah_uuid, formData);

                    revalidatePath(urlWithoutParams);
                    redirect(url);
                }}
            >
                <Stack>
                    <p>Sajdeh</p>
                    <select name="sajdeh">
                        <option value="none">None</option>
                        <option value="mostahab">Mostahab</option>
                        <option value="vajib">Vajib</option>
                    </select>

                    <InputField
                        variant="outlined"
                        placeholder="Text"
                        type="string"
                        name="text"
                    />
                    <Row align="end">
                        <BackButton>Cancel</BackButton>
                        <Button variant="filled">Add</Button>
                    </Row>
                </Stack>
            </form>
        </Container>
    );
}
