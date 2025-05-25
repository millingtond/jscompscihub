import os
import re

def modify_html_files(root_directory, css_file_path_from_root):
    """
    Modifies HTML files in the given root directory to:
    1. Remove inline styles.
    2. Remove <style> blocks.
    3. Link to an external CSS file.
    """
    abs_root_directory = os.path.abspath(root_directory)
    abs_css_file_path = os.path.join(abs_root_directory, css_file_path_from_root)

    if not os.path.exists(abs_root_directory):
        print(f"Error: Root directory '{abs_root_directory}' not found.")
        return

    print(f"Starting to process HTML files in: {abs_root_directory}")
    print(f"Target CSS file (absolute): {abs_css_file_path}")

    for dirpath, _, filenames in os.walk(abs_root_directory):
        for filename in filenames:
            if filename.lower().endswith(".html"):
                html_file_path = os.path.join(dirpath, filename)
                print(f"\nProcessing file: {html_file_path}")

                try:
                    with open(html_file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                except Exception as e:
                    print(f"  Error reading file: {e}")
                    continue

                original_content = content # Keep a copy for comparison if needed

                # 1. Remove inline style attributes (e.g., style="...")
                # This regex looks for 'style' followed by '=' and a quoted string.
                content = re.sub(r'\s*style\s*=\s*".*?"', '', content, flags=re.IGNORECASE)
                content = re.sub(r"\s*style\s*=\s*'.*?'", '', content, flags=re.IGNORECASE) # Also handle single quotes

                # 2. Remove <style>...</style> blocks entirely
                # This regex looks for <style...> tags and everything up to </style>
                content = re.sub(r'<style[^>]*>.*?</style>', '', content, flags=re.DOTALL | re.IGNORECASE)

                # 3. Add the link to the CSS file in the <head> section
                # Calculate the relative path from the HTML file's directory to the CSS file
                html_file_dir = os.path.dirname(html_file_path)
                relative_css_path = os.path.relpath(abs_css_file_path, start=html_file_dir)
                # Normalize path separators for web (use forward slashes)
                relative_css_path = relative_css_path.replace(os.path.sep, '/')
                
                css_link_tag = f'<link rel="stylesheet" href="{relative_css_path}">'

                # Try to insert the link before the closing </head> tag
                if re.search(r'</head>', content, flags=re.IGNORECASE):
                    content = re.sub(r'(</head>)', css_link_tag + r'\n\1', content, count=1, flags=re.IGNORECASE)
                    print(f"  Added CSS link: {css_link_tag} (before </head>)")
                # As a fallback, try to insert after an opening <head> tag if </head> wasn't found
                elif re.search(r'<head[^>]*>', content, flags=re.IGNORECASE):
                    content = re.sub(r'(<head[^>]*>)', r'\1\n' + css_link_tag, content, count=1, flags=re.IGNORECASE)
                    print(f"  Added CSS link: {css_link_tag} (after <head>)")
                else:
                    print(f"  Warning: Could not find <head> or </head> tag in {filename}. CSS link not added.")
                    # Optionally, you could prepend to the whole document or handle this case differently
                    # For now, we'll just skip adding the link if no head section is identifiable this way.

                if content != original_content:
                    try:
                        with open(html_file_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"  Successfully modified and saved {filename}")
                    except Exception as e:
                        print(f"  Error writing file: {e}")
                else:
                    print(f"  No changes made to {filename} (perhaps already compliant or no relevant tags found).")

    print("\nProcessing complete.")

if __name__ == "__main__":
    # --- Configuration ---
    # Adjust this to the path of your main folder containing HTML files and the CSS subfolder
    # If the script is in the same directory as 'MGSCompSci', then 'MGSCompSci' is correct.
    # If 'MGSCompSci' is elsewhere, provide the full or correct relative path.
    root_folder = "" 
    
    # This is the path to your CSS file, relative to the root_folder defined above.
    # Based on your files, it's 'css/style.css' within 'MGSCompSci'
    css_file_relative_to_root = "css/style.css" 
    # --- End Configuration ---

    # IMPORTANT: BACKUP YOUR FILES BEFORE RUNNING!
    # confirm = input(f"This script will modify HTML files in '{os.path.abspath(root_folder)}'.\nHave you backed up your files? (yes/no): ")
    # if confirm.lower() == 'yes':
    #     modify_html_files(root_folder, css_file_relative_to_root)
    # else:
    #     print("Operation cancelled. Please backup your files before running the script.")

    # For automated environments or if you've already backed up:
    # You can uncomment the line below and comment out the confirmation block above.
    # Make sure you understand the risks.
    print("Reminder: Ensure you have backed up your files before running this script if you uncomment the execution call.")
    print(f"To run, uncomment the call to modify_html_files in the __main__ block of this script and set the root_folder ('{root_folder}') and css_file_relative_to_root ('{css_file_relative_to_root}') variables correctly.")
    modify_html_files(root_folder, css_file_relative_to_root) # UNCOMMENT THIS LINE TO RUN THE SCRIPT