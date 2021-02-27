export default function createNotify(data) {
  const notifyTag = (strings, changedCourses, unsubLink) => {
    const [first, second, third] = strings;

    const info = `
    ${changedCourses
      .map(
        ({ courseName, reasons }) =>
          `<li class="item">
        ${courseName}
        <ul>
          ${reasons
            .map((reason) => `<li class="reason">${reason}</li>`)
            .join("")}
        </ul>
      </li>`
      )
      .join("")}
    `;

    return `${first}${info}${second}${unsubLink}${third}`;
  };

  const { changedCourses, unsubLink } = data;

  return notifyTag` 
      <mjml>
        <mj-head>
          <mj-title>Sekizkirk.io - Your courses have changes.</mj-title>
          <mj-font name="Agrandir" href="./css/font.css" />
          <mj-style>
            .container { display: flex; flex-direction: column; align-items: center;
            font-family: 'Agrandir'; font-size: 1.7em; color: #000 }
            .item {
              margin-top: 1em
            }
            .reason {
              margin-top: 0.2em
            }
          </mj-style>
        </mj-head>

        <mj-body background-color="#e5e5e5">
          <!-- Sekizkirk header -->
          <mj-section background-color="#000">
            <mj-column>
              <mj-text
                font-size="20px"
                color="#FFF"
                align="center"
                font-family="Agrandir"
              >
                <h1>SEKIZKIRK</h1>
              </mj-text>
            </mj-column>
          </mj-section>

          <!-- Info -->
          <mj-raw>
            <div class="container">
              <ol>${changedCourses}</ol>
            </div>
          </mj-raw>

          <!-- Footer -->
          <mj-section>
            <!-- Site Button -->
            <mj-column>
              <mj-button
                font-family="Agrandir"
                background-color="#fca311"
                color="#FFF"
                href="https://sekizkirk.io"
              >
                Go to site
              </mj-button>
            </mj-column>

            <!-- Unsub Button -->
            <mj-column>
              <mj-button
                font-family="Agrandir"
                background-color="#14213d"
                color="#FFF"
                href=${unsubLink}
              >
                Unsubscribe
              </mj-button>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml> 
  `;
}
