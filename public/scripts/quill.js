document.addEventListener("DOMContentLoaded", function () {
  const quill = new Quill("#description", {
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link"],
        ["blockquote", "code-block"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ direction: "rtl" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["hr"],
      ],
    },
  });

  // remove pasted content background
  quill.clipboard.addMatcher(Node.ELEMENT_NODE, function (node, delta) {
    delta.ops.forEach((op) => {
      if (op.attributes && op.attributes.background) {
        delete op.attributes.background;
        op.attributes.color = "#000";
      }
    });
    return delta;
  });

  // adds quill editor value to a hidden input
  const descriptionInputPlainText = document.getElementById("hidden-desc");
  const descriptionInputHTML = document.getElementById("hidden-desc-html");
  const createPostForm = document.getElementById("create-post-form");
  createPostForm.addEventListener("submit", function (e) {
    descriptionInputPlainText.value = quill.root.innerText;
    descriptionInputHTML.value = quill.root.innerHTML;
  });
});
