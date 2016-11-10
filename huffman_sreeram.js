pat='';
codes = {};
// functions
// identifies the frequency of the appearance of each characters in the string 
function frequency(str) {
	var freq = {}
	for(var i=0; i<str.length; i++) {
		if(freq[str[i]]) {
			freq[str[i]]++;

		} else {
			freq[str[i]]=1;  // default value when a new character is encountered should be 1
		}
	}
	return freq;
};

//group the characters and their frequencies into tuples and sort the list of tuples so that the least occuring characters comes in the front

function TupleandSort(freq) {
	letters = Object.keys(freq);
	freq_tuple=[];
	for(var i=0; i<letters.length; i++) {
		freq_tuple.unshift([freq[letters[i]],letters[i]]); // grouping the characters and their frequencies into a tuple
	}
	
	freq_tuple.sort(); //sorting the list of tuples 
	return freq_tuple;
};



// the sorted tuple is converted into a tree structure
function buildTree(freq_tuple) {
	while((freq_tuple.length) > 1) { 
		leastTwo = freq_tuple.slice(0,2);	
		theRest = freq_tuple.slice(2);
		combFreq = leastTwo[0][0] + leastTwo[1][0];
		theRest.push([combFreq, leastTwo]);
		freq_tuple = theRest;
		freq_tuple.sort();
		}
	
	return freq_tuple[0];
	};
//the newly obtained tree is trimmed of its frequencies but the structure is still retained
function trimTree(tree) {
	var p = tree[1];
	if(typeof(p) == typeof('')) { //to detect a leaf
		return p;
	} else {
		return [trimTree(p[0]), trimTree(p[1])];
	}
};

//the characters are assigned codes based on their location in the tree. every left turn will be a 0 and a right turn will be a 1
function assignCodes(node, pat) {
    if(typeof(node) == typeof("")) { //detect a leaf
         codes[node] = pat;       
	}         
    else{                               
        assignCodes(node[0], pat+"0");    
        assignCodes(node[1], pat+"1"); 
	}
    return codes;
};

// we have the characters assigned codes. Now we inspect the input string and replace each character in the string with the code 
function encode(str) {
	output='';
	for(i=0; i<str.length; i++){
		output += codes[str[i]]
	}
	return output;
	
};
// the encoded output after compression is decoded back with the help of the tree structure we have obtained before. 
function decode(tree, str){
	output='';
	p = tree;
	for(i=0; i<str.length; i++){
		if(str[i] == 0){
			p=p[0];
		}
		else{
			p=p[1];
		}
	if(typeof(p) == typeof('')){
		output+=p;
		p= tree;  //once ouput is obtained for one character the tree must restart again from the beginning
	}
	}
	return output;
};
// main program
var rl = require("readline");
var prompts = rl.createInterface(process.stdin, process.stdout);
prompts.question("Enter the String", function (newstr) { //accepts the input string to the variable newstring
var sorted_tuple = TupleandSort(frequency(newstr)); //assigning the sorted tuple to freq_tuple
var tree = buildTree(sorted_tuple); //building a tree structure with the sorted tuple 
var tree = trimTree(tree); //trimming the tree to characters alone
var codes = assignCodes(tree,pat); //assigning unique codes for each characters based on their position in the tree
console.log("codes\n",codes);
var encoded_data = encode(newstr); //encoding the given string with the obtained codes
console.log("compressed\n",encoded_data); 
var decoding = decode(tree,encoded_data);//decoding the codes back to obtain the original string
console.log("decoded\n",decoding);
 process.exit();
});
