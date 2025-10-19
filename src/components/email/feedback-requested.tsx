import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Link,
  Tailwind,
  Img,
} from "@react-email/components";
import appTailwindConfig from "../../../tailwind.config";

// Remove or adjust darkMode property for react-email compatibility
const emailTailwindConfig = {
  ...appTailwindConfig,
  darkMode: undefined,
};

interface Props {
  authorFirstName: string;
  ownerProfilePicURL?: string;
  ownerFirstName: string;
  feedbackUrl: string;
  sessionIntro?: string;
}

export function FeedbackRequested({
  authorFirstName,
  ownerFirstName,
  feedbackUrl,
  sessionIntro,
  ownerProfilePicURL,
}: Props) {
  return (
    <Html>
      <Tailwind config={emailTailwindConfig}>
        <Body className="bg-gray-50 p-1">
          <Container>
            <div className="p-5">
              <Img
                alt="improveme.io"
                width={312 / 2}
                src="https://www.improveme.io/HeroLogo.png"
                className="mb-10"
              />

              <div className="flex">
                {ownerProfilePicURL && (
                  <div className="mr-4 h-10 w-10 overflow-clip rounded-full">
                    <Img
                      className="[margin:0_auto] w-10"
                      src={ownerProfilePicURL}
                    />
                  </div>
                )}

                <Heading className="mt-1 mb-0 text-2xl">
                  {ownerFirstName} has requested your feedback.
                </Heading>
              </div>

              <Text className="mb-1 text-gray-700">
                Hello {authorFirstName},
              </Text>

              <Text className="mb-6 text-gray-700">
                {ownerFirstName} has asked you to provide feedback using
                improveme.io — an app that empowers anyone, regardless of the
                context or setting, to collect feedback from the people they
                collaborate with.
              </Text>

              {sessionIntro && (
                <Text className="mb-6 text-sm text-gray-900">
                  “{sessionIntro}”
                </Text>
              )}

              <Text className="mb-6 text-sm text-gray-700">
                Please click the button below to continue.
              </Text>

              <Button
                href={feedbackUrl}
                className="text-md grow-0 rounded bg-sky-700 p-4 text-white"
              >
                Give Feedback to {ownerFirstName}
              </Button>

              <Text className="mt-6 text-sm text-gray-600">
                You can also copy and paste this link into your browser:
              </Text>

              <Link href={feedbackUrl} className="text-blue underline">
                {feedbackUrl}
              </Link>
            </div>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
