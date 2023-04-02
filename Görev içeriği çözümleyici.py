def program(string):
    alfabe = "abcdefghijklmnopqrstuvwxyz"
    x = list(alfabe)
    result = ""

    for char in string:
        if(alfabe.count(char)):
            #result = result + alfabe[alfabe.index(char)]
            if(alfabe.index(char) == 0):
                result = result + "z"

            elif(alfabe.index(char) == 25):
                result = result + "a"
        
            else:
                result = result + (alfabe[25-(alfabe.index(char))])
        
        else:
            result = result + char
            
    print(result)  
     
program("Povzhv hvmw z nvhhztv drgs xfiivmg hvhhrlm rm qhlm ulinzg erz gsrh vcznkov : {\"gbkv\":\"REGISTER\",\"mznv\":\"blfi mznv\",\"hfimznv\":\"blfi hfimznv\",\"vnzro\":\"blfi vnzro zwwivhh\",\"ivtrhgizgrlmKvb\":\"ccc\"}. Kvvk orhgvmrmt mvd nvhhztv uli gzhp xlmgvmg! Ylfi ivtrhgizgrlmKvb : 25zwyy0520851xx354zz9930yy7w5347xuv327902079uwy1v3y54y0287417z6v")
