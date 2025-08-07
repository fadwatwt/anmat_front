# AI Chat App

## AI File/Image Demo

To enable AI file/image responses in the chat demo:

- Place a sample PDF file named `sample-agenda.pdf` in the `public/images/AiAssistant` folder.
- Place a sample image file named `sample-image.png` in the same folder.
- When the user sends a message containing the word `agenda`, the AI will respond with a file card for the PDF.
- When the user sends a message containing the word `image`, the AI will respond with an image card.

## AI Links in Responses

The AI can also provide links in its responses. To support this, the AI message object can include a `links` array:

```js
{
  sender: "ai",
  text: "Here are some useful links:",
  links: [
    { label: "View reference", url: "https://example.com/reference" },
    { label: "Open documentation", url: "https://example.com/docs" }
  ]
}
```

Update the message rendering logic to display these links as styled buttons or anchor tags, similar to the design in your screenshots.
