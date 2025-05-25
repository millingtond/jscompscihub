import os
import re

def remove_specific_stylesheet_links(root_directory):
    """
    Traverses all HTML files in the root_directory and removes stylesheet links
    if the CSS filename in the href matches the HTML filename.
    e.g., in 'example.html', a link to 'css/example.css' or 'example.css' would be removed.
    """
    abs_root_directory = os.path.abspath(root_directory)

    if not os.path.exists(abs_root_directory):
        print(f"Error: Root directory '{abs_root_directory}' not found.")
        return

    print(f"Starting to process HTML files in: {abs_root_directory}")

    for dirpath, _, filenames in os.walk(abs_root_directory):
        for filename in filenames:
            if filename.lower().endswith(".html"):
                html_file_path = os.path.join(dirpath, filename)
                # Get the HTML filename without the .html extension
                html_filename_no_ext, _ = os.path.splitext(filename)
                
                print(f"\nProcessing file: {html_file_path}")
                print(f"  HTML base name: {html_filename_no_ext}")

                try:
                    with open(html_file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                except Exception as e:
                    print(f"  Error reading file: {e}")
                    continue
                
                original_content = content

                # Define a callback function for re.sub
                # This function will be called for every match of '<link[^>]*>'
                def replace_link_if_matches(match):
                    link_tag_html = match.group(0) # The entire matched <link ...> tag

                    # 1. Check if it's a stylesheet link (rel="stylesheet")
                    # We search for rel="stylesheet" within the matched link_tag_html
                    # Using re.IGNORECASE for attribute names and values like 'stylesheet'
                    rel_attr_match = re.search(r'rel\s*=\s*["\']stylesheet["\']', link_tag_html, re.IGNORECASE)
                    if not rel_attr_match:
                        return link_tag_html # Not a 'rel="stylesheet"' link, so keep it

                    # 2. Extract the href attribute value
                    href_search = re.search(r'href\s*=\s*["\']([^"\']+)["\']', link_tag_html, re.IGNORECASE)
                    if not href_search:
                        return link_tag_html # No href attribute found, so keep it
                    
                    href_value = href_search.group(1).strip() # The value of href

                    # 3. Get the filename part of the href (e.g., from "css/some-name.css" extract "some-name.css")
                    css_filename_with_ext = os.path.basename(href_value)
                    
                    # 4. Get the CSS filename without its extension (e.g., from "some-name.css" extract "some-name")
                    css_filename_no_ext, css_ext = os.path.splitext(css_filename_with_ext)

                    # 5. Ensure it's actually a .css file being linked
                    if css_ext.lower() != '.css':
                        return link_tag_html # The href does not point to a .css file, keep the tag

                    # 6. Compare the HTML base name with the CSS base name (case-insensitive)
                    if html_filename_no_ext.lower() == css_filename_no_ext.lower():
                        print(f"    Removing matching link: {link_tag_html.strip()}")
                        return ""  # Return an empty string to remove the tag
                    
                    return link_tag_html # Filenames don't match, or other conditions not met, so keep the tag

                # The main regex for re.sub finds all <link ...> tags.
                # The refined_replace_link_tag callback then does the detailed checks.
                modified_content = re.sub(r'<link[^>]*>', replace_link_if_matches, content, flags=re.IGNORECASE | re.DOTALL)
                
                if modified_content != original_content:
                    try:
                        with open(html_file_path, 'w', encoding='utf-8') as f:
                            f.write(modified_content)
                        print(f"  Successfully modified and saved {filename}")
                    except Exception as e:
                        print(f"  Error writing file: {e}")
                else:
                    print(f"  No specific stylesheet links to remove in {filename} based on naming convention.")

    print("\nProcessing complete.")

if __name__ == "__main__":
    # --- Configuration ---
    # Adjust this to the path of your main folder containing HTML files.
    # If the script is in the same directory as 'MGSCompSci', then 'MGSCompSci' is correct.
    # If 'MGSCompSci' is elsewhere, provide the full or correct relative path.
    root_folder = "" 
    # --- End Configuration ---

    # IMPORTANT: ENSURE YOU HAVE BACKED UP YOUR FILES BEFORE RUNNING!
    # confirm = input(f"This script will attempt to remove specific stylesheet links in HTML files within '{os.path.abspath(root_folder)}'.\nThis operation modifies files directly.\nHave you backed up your '{root_folder}' directory? (yes/no): ")
    # if confirm.lower() == 'yes':
    #     remove_specific_stylesheet_links(root_folder)
    # else:
    #     print("Operation cancelled. Please backup your files before running the script.")

    # For automated environments or if you've already backed up:
    # You can uncomment the line below and comment out the confirmation block above.
    # Make sure you understand the risks.
    print("Reminder: Ensure you have backed up your files before running this script if you uncomment the execution call.")
    print(f"To run, uncomment the call to remove_specific_stylesheet_links in the __main__ block of this script and ensure the root_folder ('{root_folder}') is set correctly.")
    remove_specific_stylesheet_links(root_folder) # UNCOMMENT THIS LINE TO RUN THE SCRIPT
