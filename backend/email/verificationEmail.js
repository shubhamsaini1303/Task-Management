const React = require("react");
const {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} = require("@react-email/components");

function VerificationEmail({ name, otp }) {
  return React.createElement(
    Html,
    { lang: "en", dir: "ltr" },
    React.createElement(
      Head,
      null,
      React.createElement("title", null, "Verification Code"),
      React.createElement(Font, {
        fontFamily: "Roboto",
        fallbackFontFamily: "Verdana",
        webFont: {
          url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
          format: "woff2",
        },
        fontWeight: 400,
        fontStyle: "normal",
      })
    ),
    React.createElement(
      Preview,
      null,
      `Here's your verification code: ${otp}`
    ),
    React.createElement(
      Section,
      null,
      React.createElement(
        Row,
        null,
        React.createElement(Heading, { as: "h2" }, `Hello ${name},`)
      ),
      React.createElement(
        Row,
        null,
        React.createElement(
          Text,
          null,
          "Thank you for registering. Please use the following verification code to complete your registration:"
        )
      ),
      React.createElement(Row, null, React.createElement(Text, null, otp)),
      React.createElement(
        Row,
        null,
        React.createElement(
          Text,
          null,
          "If you did not request this code, please ignore this email."
        )
      ),
      React.createElement(
        Row,
        null,
        React.createElement(
          Button,
          {
            href: `http://localhost:3000/verify/${name}`,
            style: { color: "#61dafb" },
          },
          "Verify here"
        )
      )
    )
  );
}

module.exports = VerificationEmail;
