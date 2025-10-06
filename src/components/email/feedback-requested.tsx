import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Link,
  Tailwind,
} from "@react-email/components";
import appTailwindConfig from "../../../tailwind.config";

interface Props {
  authorFirstName: string;
  ownerFirstName: string;
  feedbackUrl: string;
}

export function FeedbackRequested({
  authorFirstName,
  ownerFirstName,
  feedbackUrl,
}: Props) {
  return (
    <Html>
      <Tailwind config={appTailwindConfig}>
        <Body className="bg-gray-100 p-8">
          <Container className="rounded-md bg-white p-6">
            <Heading className="mb-4 text-2xl font-bold text-pink-500">
              Welcome, {authorFirstName}!
            </Heading>

            <Text className="mb-6 text-gray-700">
              You’ve been invited to provide feedback for {ownerFirstName}.
              Please click the button below to continue.
            </Text>

            <Button
              href={feedbackUrl}
              className="rounded bg-pink-300 px-6 py-3 font-bold text-white no-underline"
            >
              Give Your Feedback
            </Button>

            <Text className="mt-6 text-sm text-gray-600">
              If the button doesn’t work, copy and paste this link into your
              browser:
            </Text>

            <Link href={feedbackUrl} className="text-blue underline">
              {feedbackUrl}
            </Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
