import Head from "next/head";

type PageHeadProps = {
  title?: string;
  description?: string;
};

export const PageHead = ({
  title = "",
  description = "Request, author and own your feedback",
}: PageHeadProps) => {
  return (
    <Head>
      <title>{`${title} ~ improveme.io`}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
