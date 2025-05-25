import os
import re

def separate_code(root_dir):
    """Separates inline CSS and JS from HTML files into external files."""

    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".html"):
                filepath = os.path.join(dirpath, filename)
                with open(filepath, "r", encoding="utf-8") as f:
                    html_content = f.read()

                # Extract CSS
                css_match = re.search(r"<style>(.*?)</style>", html_content, re.DOTALL)
                if css_match:
                    css_content = css_match.group(1).strip()
                    css_filename = filename.replace(".html", ".css")
                    css_filepath = os.path.join(root_dir, "css", css_filename) # Assuming 'css' dir in root
                    os.makedirs(os.path.join(root_dir, "css"), exist_ok=True)
                    with open(css_filepath, "w", encoding="utf-8") as css_file:
                        css_file.write(css_content)
                    html_content = html_content.replace(css_match.group(0), f'\n    <link rel="stylesheet" href="css/{css_filename}">')

                # Extract JS
                js_match = re.search(r"<script>(.*?)</script>", html_content, re.DOTALL)
                if js_match:
                    js_content = js_match.group(1).strip()
                    # Skip empty script blocks or those only linking to external files (no code inside)
                    if js_content and not js_content.startswith("src="):
                        js_filename = filename.replace(".html", ".js")
                        js_filepath = os.path.join(root_dir, "js", js_filename) # Assuming 'js' dir in root
                        os.makedirs(os.path.join(root_dir, "js"), exist_ok=True)
                        with open(js_filepath, "w", encoding="utf-8") as js_file:
                            js_file.write(js_content)
                        html_content = html_content.replace(js_match.group(0), f'\n    <script src="js/{js_filename}"></script>\n    <script src="js/worksheet-common.js"></script>
</body>
') # Move to end of body and adjust closing tag
                        html_content = html_content.replace("    <script src="js/worksheet-common.js"></script>
</body>
\n    <script src=", "<script src=") # Avoid duplicate     <script src="js/worksheet-common.js"></script>
</body>


                # Write modified HTML
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(html_content)
                    print(f"Processed: {filepath}")

# --- Usage ---
root_directory = r"c:\Users\Dan Mill\OneDrive - Manchester Grammar School\MGSCompSci"
separate_code(root_directory)

print("Completed separation of inline CSS and JavaScript.")
