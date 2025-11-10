import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';

export default class MyDocument extends Document<DocumentInitialProps & { locale?: string }> {
  render() {
    const { locale } = this.props;
    return (
      <Html lang={locale || 'en'}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const initialProps = await Document.getInitialProps(ctx);
  return {
    ...initialProps,
    locale: ctx.locale || 'en',
  };
};
