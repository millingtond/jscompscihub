// Initialize Mermaid
        mermaid.initialize({ startOnLoad: false, theme: 'default' }); 

        const pythonCodeEl = document.getElementById('pythonCode');
        const generateFlowchartBtn = document.getElementById('generateFlowchartBtn');
        const flowchartOutputEl = document.getElementById('flowchartOutput');
        const errorMessageEl = document.getElementById('errorMessage');
        const loadingIndicatorEl = document.getElementById('loadingIndicator');
        
        const generateRandomBtn = document.getElementById('generateRandomBtn');
        const prevExampleBtn = document.getElementById('prevExampleBtn');
        const nextExampleBtn = document.getElementById('nextExampleBtn');
        const exampleCounterEl = document.getElementById('exampleCounter');

        // Curated examples for stepping through
        const predefinedExamples = [
            { name: "Simple Assignment & Print", code: `name = "Bob"\nprint("Hello, " + name)` },
            { name: "User Input & Output", code: `age_str = input("Enter your age: ")\nage = int(age_str)\nprint("Next year you will be: " + str(age + 1))` },
            { name: "Basic Arithmetic", code: `a = 15\nb = 4\nsum_val = a + b\ndiff_val = a - b\nprod_val = a * b\nquot_val = a / b\nprint(sum_val)\nprint(prod_val)` },
            { name: "Simple If Statement", code: `temperature = 25\nif temperature > 20:\n    print("It's a warm day!")\nprint("Enjoy your day!")` },
            { name: "If-Else Statement", code: `score = 75\nif score >= 60:\n    print("You passed.")\nelse:\n    print("You failed.")` },
            { name: "If-Elif-Else Statement", code: `grade = 88\nif grade >= 90:\n    print("Grade: A")\nelif grade >= 80:\n    print("Grade: B")\nelif grade >= 70:\n    print("Grade: C")\nelse:\n    print("Grade: D or F")` },
            { name: "For Loop (range)", code: `print("Counting up:")\nfor i in range(1, 6):\n    print(i)\nprint("Counting down:")\nfor j in range(3, 0, -1):\n    print(j)` },
            { name: "While Loop", code: `count = 0\nwhile count < 5:\n    print("Count is: " + str(count))\n    count = count + 1\nprint("Loop finished.")` },
            { name: "Nested If Statement", code: `x = 10\ny = 20\nif x > 5:\n    print("x is greater than 5")\n    if y > 15:\n        print("y is also greater than 15")\n    else:\n        print("y is not greater than 15")\nelse:\n    print("x is not greater than 5")` },
            { name: "Loop with If Statement", code: `total = 0\nfor number in range(1, 8):\n    if number % 2 == 0:\n        print("Even number: " + str(number))\n        total = total + number\n    else:\n        print("Odd number: " + str(number))\nprint("Sum of even numbers: " + str(total))` }
        ];

        // Larger pool of basic snippets for the "Random Basic Code" button
        const randomCodeSnippets = [
            `a = 5\nprint(a)`,
            `x = 10\ny = 20\nz = x + y\nprint(z)`,
            `message = "Python is fun!"\nprint(message)`,
            `val1 = 100\nval2 = 50\nprint(val1 - val2)`,
            `item_price = 19.99\nquantity = 3\ntotal_cost = item_price * quantity\nprint(total_cost)`,
            `is_active = True\nprint(is_active)`,
            `num1 = 7\nnum2 = 3\nremainder = num1 % num2\nprint(remainder)`,
            `city = input("Enter your city: ")\nprint("You live in " + city)`,
            `value = 10\nif value > 5:\n    print("Greater than 5")`,
            `value = 3\nif value > 5:\n    print("Greater than 5")\nelse:\n    print("Not greater than 5")`,
            `for k in range(3):\n    print("Loop iteration")`,
            `counter = 1\nwhile counter <= 2:\n    print("While loop")\n    counter = counter + 1`,
            `b = 10\nb = b + 5\nprint(b)`,
            `text = "Hello"\nrepeated_text = text * 3\nprint(repeated_text)`,
            `num_a = 2\nnum_b = 3\nnum_c = 4\naverage = (num_a + num_b + num_c) / 3\nprint(average)`,
            `print("Line 1")\nprint("Line 2")`,
            `x = 1\nif x == 1:\n    print("x is one")`,
            `y = 5\nif y != 10:\n    print("y is not ten")`,
            `z = 0\nif z >= 0:\n    print("z is non-negative")`,
            `limit = 2\nfor num in range(limit):\n    print(num * 10)`,
            `a = True\nb = False\nif a and not b:\n    print("Condition met")`,
            `name = "Test"\nprint(name)\nname = "Changed"\nprint(name)`,
            `val = 100\nval = val / 2\nprint(val)`,
            `i = 0\nif i < 1:\n    print("i is small")\n    i = i + 1\nprint("i is now " + str(i))`,
            `print("Start process")\n# This is a comment\nresult = 10 * 2\nprint(result)\nprint("End process")`,
            `num = int(input("Enter a number: "))\nif num > 0:\n    print("Positive")\nelif num < 0:\n    print("Negative")\nelse:\n    print("Zero")`,
            `count = 3\nwhile count > 0:\n    print(count)\n    count = count - 1\nprint("Blast off!")`,
            `items = 0\nif items == 0:\n    print("No items")\nitems = items + 1\nprint("One item added")`,
            `x = 5\ny = 5\nif x == y:\n    print("x and y are equal")`,
            `status = "pending"\nif status == "pending":\n    print("Awaiting processing...")\nstatus = "complete"\nprint("Processing " + status)`
        ];


        let currentExampleIndex = -1; 

        function loadSpecificCode(codeToLoad, isFromPredefinedList = false, index = -1, name = "") {
            pythonCodeEl.value = codeToLoad;
            if (isFromPredefinedList) {
                currentExampleIndex = index;
                exampleCounterEl.textContent = `Example ${index + 1} of ${predefinedExamples.length}: ${name}`;
            } else {
                // If loading random code, clear the "Example x of y" display or set a generic message
                exampleCounterEl.textContent = "Random Code Loaded";
            }
            // Clear previous flowchart and error messages
            flowchartOutputEl.innerHTML = '<p class="text-gray-500">Flowchart will appear here...</p>';
            errorMessageEl.classList.add('hidden');
        }


        generateRandomBtn.addEventListener('click', () => {
            const randomIndex = Math.floor(Math.random() * randomCodeSnippets.length);
            loadSpecificCode(randomCodeSnippets[randomIndex]);
        });

        prevExampleBtn.addEventListener('click', () => {
            let newIndex = currentExampleIndex - 1;
            if (newIndex < 0) {
                newIndex = predefinedExamples.length - 1; 
            }
            loadSpecificCode(predefinedExamples[newIndex].code, true, newIndex, predefinedExamples[newIndex].name);
        });

        nextExampleBtn.addEventListener('click', () => {
            let newIndex = currentExampleIndex + 1;
            if (newIndex >= predefinedExamples.length) {
                newIndex = 0; 
            }
            loadSpecificCode(predefinedExamples[newIndex].code, true, newIndex, predefinedExamples[newIndex].name);
        });
        
        // Load the first predefined example by default
        if (predefinedExamples.length > 0) {
            loadSpecificCode(predefinedExamples[0].code, true, 0, predefinedExamples[0].name);
        }


        generateFlowchartBtn.addEventListener('click', async () => {
            const code = pythonCodeEl.value;
            if (!code.trim()) {
                errorMessageEl.textContent = 'Please enter some Python code.';
                errorMessageEl.classList.remove('hidden');
                flowchartOutputEl.innerHTML = '<p class="text-gray-500">Flowchart will appear here...</p>';
                return;
            }

            errorMessageEl.classList.add('hidden');
            flowchartOutputEl.innerHTML = ''; 
            loadingIndicatorEl.classList.remove('hidden');

            try {
                const response = await fetch('http://127.0.0.1:5001/generate_flowchart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code: code }),
                });

                loadingIndicatorEl.classList.add('hidden');
                const data = await response.json();

                if (response.ok) {
                    if (data.mermaid_code) {
                        const { svg, bindFunctions } = await mermaid.render('graphDiv', data.mermaid_code);
                        flowchartOutputEl.innerHTML = svg;
                        if (bindFunctions) {
                           bindFunctions(flowchartOutputEl);
                        }
                    } else {
                        errorMessageEl.textContent = 'Backend returned no mermaid code.';
                        errorMessageEl.classList.remove('hidden');
                        flowchartOutputEl.innerHTML = '<p class="text-red-500">Could not generate flowchart.</p>';
                    }
                } else {
                    let errorMsg = `Error: ${data.error || 'Unknown error from server.'}`;
                    if(data.details) errorMsg += `\nDetails: ${JSON.stringify(data.details, null, 2)}`;
                    errorMessageEl.textContent = errorMsg;
                    errorMessageEl.classList.remove('hidden');
                    flowchartOutputEl.innerHTML = '<p class="text-red-500">Could not generate flowchart.</p>';
                }
            } catch (error) {
                loadingIndicatorEl.classList.add('hidden');
                console.error('Error:', error);
                errorMessageEl.textContent = 'An error occurred while communicating with the server: ' + error.message;
                errorMessageEl.classList.remove('hidden');
                flowchartOutputEl.innerHTML = '<p class="text-red-500">Could not generate flowchart.</p>';
            }
        });