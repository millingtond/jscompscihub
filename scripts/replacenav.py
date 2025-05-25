import os
import re

# --- Configuration ---
ROOT_WEBSITE_FOLDER = ""

# Regex to identify and remove the old/existing navbar.
OLD_NAV_REGEX_PATTERN = r'<nav\s+class="bg-gray-800 text-white p-3 no-print sticky top-0 z-50 shadow-md mb-6"[^>]*>.*?</nav>'

# The HTML template for the NEW navigation bar.
# {prefix} will be replaced with the correct relative path (e.g., "", "../", "../../").
NEW_NAV_BAR_TEMPLATE_HTML = """
<nav class="bg-gray-800 text-white p-3 no-print sticky top-0 z-50 shadow-md mb-6">
    <div class="max-w-6xl mx-auto flex justify-between items-center">
        <a href="{prefix}home.html" class="text-xl font-bold hover:text-gray-300 transition-colors">MGS CS Hub</a>
        <ul class="flex space-x-3 lg:space-x-4">
        </ul>
        <ul class="flex flex-wrap space-x-2 sm:space-x-3 lg:space-x-4 text-sm sm:text-base">
            <li><a href="#" class="hover:text-gray-300 transition-colors">Year 7</a></li>
            <li><a href="#" class="hover:text-gray-300 transition-colors">Year 8</a></li>
            <li><a href="#" class="hover:text-gray-300 transition-colors">Year 9</a></li>
            <li><a href="{prefix}gcse.html" class="hover:text-gray-300 transition-colors">GCSE</a></li>
            <li><a href="#" class="hover:text-gray-300 transition-colors">A Level</a></li>
            <li><a href="#" class="hover:text-gray-300 transition-colors">Competitions</a></li>
            <li><a href="#" class="hover:text-gray-300 transition-colors">CS News</a></li>
            <li><a href="#" class="hover:text-gray-300 transition-colors">Extracurricular</a></li>
        </ul>
    </div>
</nav>
"""
# --- End Configuration ---

def replace_navbar_in_html_files(root_dir, old_nav_pattern, new_nav_template):
    abs_root_dir = os.path.abspath(root_dir)

    if not os.path.exists(abs_root_dir):
        print(f"Error: Root directory '{abs_root_dir}' not found.")
        return

    print(f"Starting to process HTML files in: {abs_root_dir}")
    files_processed_count = 0
    files_modified_count = 0

    for dirpath, _, filenames in os.walk(abs_root_dir):
        for filename in filenames:
            if filename.lower().endswith(".html"):
                html_file_full_path = os.path.join(dirpath, filename)
                files_processed_count += 1
                print(f"\nProcessing file: {html_file_full_path}")

                try:
                    with open(html_file_full_path, 'r', encoding='utf-8') as f:
                        original_content = f.read()
                except Exception as e:
                    print(f"  Error reading file: {e}")
                    continue
                
                current_content = original_content

                # 1. Remove old/existing navbar(s)
                current_content, num_removals = re.subn(
                    old_nav_pattern, '', current_content,
                    flags=re.DOTALL | re.IGNORECASE
                )
                if num_removals > 0:
                    print(f"  Removed {num_removals} instance(s) of the old/existing navbar.")
                else:
                    print(f"  No old/existing navbar found to remove (or pattern didn't match).")

                # 2. Prepare new navbar HTML
                html_file_dir_abs = os.path.dirname(os.path.abspath(html_file_full_path))
                path_to_root_from_html_dir = os.path.relpath(abs_root_dir, start=html_file_dir_abs)
                
                path_prefix = ""
                if path_to_root_from_html_dir == ".":
                    path_prefix = ""
                else:
                    path_prefix = os.path.normpath(path_to_root_from_html_dir).replace(os.path.sep, '/') + "/"
                
                formatted_new_nav_bar_html = new_nav_template.strip().format(prefix=path_prefix)
                
                # 3. Attempt to insert the new navbar
                navbar_added = False
                
                # Primary target: After <body> tag
                body_tag_regex = r'(<body[^>]*>)'
                
                def insert_after_tag_func(tag_to_find_group, new_html):
                    def replacement_func(match_obj):
                        matched_tag = match_obj.group(tag_to_find_group) # group(1) for the captured tag
                        return matched_tag + '\n' + new_html + '\n'
                    return replacement_func

                temp_content, num_additions_body = re.subn(
                    body_tag_regex,
                    insert_after_tag_func(1, formatted_new_nav_bar_html),
                    current_content,
                    count=1,
                    flags=re.IGNORECASE
                )
                if num_additions_body > 0:
                    current_content = temp_content
                    navbar_added = True
                    print(f"  Added the new navbar after <body> tag (primary target).")
                else:
                    print(f"  Primary target <body> not found or insertion failed. Attempting fallback...")
                    # Fallback target: After </head> tag
                    head_tag_regex = r'(</head>)'
                    temp_content_head, num_additions_head = re.subn(
                        head_tag_regex,
                        insert_after_tag_func(1, formatted_new_nav_bar_html),
                        current_content,
                        count=1,
                        flags=re.IGNORECASE
                    )
                    if num_additions_head > 0:
                        current_content = temp_content_head
                        navbar_added = True
                        print(f"  Added the new navbar after </head> tag (fallback target).")
                    else:
                        print(f"  Warning: Could not find <body> (primary) OR </head> (fallback) tag. Navbar not added.")
                
                # 4. Write content back if any changes were made
                if current_content != original_content:
                    try:
                        with open(html_file_full_path, 'w', encoding='utf-8') as f:
                            f.write(current_content)
                        print(f"  Successfully saved modifications to {filename}")
                        files_modified_count +=1
                    except Exception as e:
                        print(f"  Error writing file: {e}")
                else:
                    print(f"  No changes made to {filename} (final content is identical to original or navbar could not be added).")

    print(f"\nProcessing complete. Processed {files_processed_count} HTML files. Modified {files_modified_count} files.")

if __name__ == "__main__":
    print("Reminder: Ensure you have backed up your files before running this script!")
    print(f"This script will attempt to REMOVE existing navbars and ADD a NEW navbar to HTML files in '{os.path.abspath(ROOT_WEBSITE_FOLDER)}'.")
    print("It will try to add the navbar after the <body> tag first, then after </head> as a fallback.")
    # print("Review the OLD_NAV_REGEX_PATTERN and NEW_NAV_BAR_TEMPLATE_HTML variables in the script before proceeding.")
    # confirm = input("Have you backed up your files and reviewed the configuration? (yes/no): ")
    # if confirm.lower() == 'yes':
    #    replace_navbar_in_html_files(ROOT_WEBSITE_FOLDER, OLD_NAV_REGEX_PATTERN, NEW_NAV_BAR_TEMPLATE_HTML)
    # else:
    #    print("Operation cancelled. Please backup your files and review settings before running.")

    # For automated use or if you are sure and have backed up:
    print("To execute, uncomment the call to 'replace_navbar_in_html_files' in the __main__ block of this script after careful review and backup.")
    replace_navbar_in_html_files(ROOT_WEBSITE_FOLDER, OLD_NAV_REGEX_PATTERN, NEW_NAV_BAR_TEMPLATE_HTML) # UNCOMMENT THIS LINE TO RUN