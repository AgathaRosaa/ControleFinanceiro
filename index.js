let transactions=[]


function createdContainer(id){
    const container= document.createElement('div')
    container.classList.add('container')
    container.id= `container-${id}`
    return container
}

function createdName(name){
    const text= document.createElement('span')
    text.classList.add('text')
    text.textContent= name
    return text 
}

function createdValue(amount){
    const span= document.createElement('span')
    const formater= Intl.NumberFormat('pt-BR',{
        compactDisplay:'long',
        currency:'BRL',
        style:'currency',
    })

    const formated= formater.format(amount)
    if(amount>0){
        span.classList.add('credit')
        span.textContent= `${formated} C`
    }
    else{
        span.classList.add('debit')
        span.textContent=`${formated} D`
    }
    
    return span
}

function render(transaction){
    const container= createdContainer(transaction.id)
    const name= createdName(transaction.name)
    const value= createdValue(transaction.amount)
    const btnEd= createdbtnEd(transaction)

    document.querySelector('#show').appendChild(container)
    container.append(name,value, transaction)
   
}

async function addFetch(){
    return await fetch("http://localhost:3000/transactions").then(res=> res.json())
    
}

async function addVet(){
    const results= await addFetch()
    transactions.push(...results)
    transactions.forEach(render)

    upDate()
}

function upDate(){
    const saldo= transactions.reduce((acc,transaction)=> acc + transaction.amount,0)
    const balance= document.querySelector("#balance")
    const formater= Intl.NumberFormat('pt-BR',{
        compactDisplay:'long',
        currency:'BRL',
        style:'currency'
    })
    const saldoat= formater.format(saldo)
    balance.textContent= saldoat
}

async function save(ev){
    ev.preventDefault()
    const id= document.querySelector("#id").value
    const name= document.querySelector("#name").value
    const amount= parseFloat(document.querySelector("#number").value)

    if(id){
        const response= await fetch(`http://localhost:3000/transactions/${id}`,{
            method:"PUT",
            body: JSON.stringify({name,amount}),
            headers:{
                "Content-type": 'application/json'
            }
        })
        const transaction= response.json()
        const indexRemove= transactions.findIndex((i)=> i.id === id)
        transactions.splice(indexRemove,1,transaction)
        document.querySelector(`#container-${id}`).remove
        render(transaction)

    }

    else{
    const response= await fetch(  "http://localhost:3000/transactions", {
        method:"POST",
        body: JSON.stringify({name,amount}),
        headers:{
            "Content-type": 'application/json'
        }
    })
    const transaction= response.json()
    transactions.push(transaction)
    render(transaction)
}

    ev.target.reset()
    upDate()
}

function createdbtnEd(transaction){
    const btnEd= document.createElement('button')
    btnEd.classList.add('btnEdit')
    btnEd.textContent= 'EDITAR'
    btnEd.addEventListener('click', ()=>{
        document.querySelector("#name").value= transaction.name
        document.querySelector("#number").value= transaction.amount
    })
}

document.addEventListener('DOMContentLoaded', addVet)
document.querySelector('#save').addEventListener('click', save)