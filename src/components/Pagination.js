import {a} from 'react-router-dom'
import {useState} from 'react'

const Pagination = ({count, totalPage, currentPage, handleCurrentPageChange, pageChange}) => {  
    currentPage = Number(currentPage) || 1
    totalPage = Number(totalPage)
    
    let nextPage = currentPage + 1
    nextPage = nextPage >= totalPage ? totalPage : nextPage;
    let lastPage = totalPage 

    let prevPage = currentPage - 1
    prevPage = prevPage < 1 ? 1 : prevPage;
    let firstPage = 1
    
    const [pageSize, setPageSize] = useState(10)
 

    //只显示5页 6 2
    const pages = []
    if (currentPage <= 3) {
        for(let i = 1; i <= (totalPage <= 5 ? totalPage : 5); i++){
            pages.push(i)
        }
    } else if (currentPage > 3 && totalPage <= (currentPage + 2)){     
        
        for(let i = totalPage - 4; i <= totalPage; i++){
            i = i || 1
            pages.push(i)
        }
    } else if (currentPage > 3 && totalPage > (currentPage + 2)){
        for(let i = currentPage - 2; i <= currentPage + 2; i++){
            pages.push(i)
        }
    }

    const PageItem = ({handleCurrentPageChange}) => {
        return (
            pages.map((page, index) => {
                return  currentPage == page ? 
                    <span className="current" key={index}>{page}</span> 
                    : <span className="page" key={index}>
                        <a onClick={() => handleCurrentPageChange(page, pageSize)}>{page}</a>
                    </span>
            })
        )
    }
    
    return (
        <div className="pagination">
            <span className="count">总共 {count || 0} 条</span>
            {totalPage > 1 && currentPage > 1 &&
               <>
                <span className="first" key="first">
                    <a onClick={() => handleCurrentPageChange(firstPage, pageSize)}>&lt;</a>
                </span>
        
                <span className="previous" key="prev">
                    <a onClick={() => handleCurrentPageChange(prevPage, pageSize)}>&lt;&lt;</a>
                </span>
               </>
            }

            <PageItem handleCurrentPageChange={handleCurrentPageChange}/>

            {totalPage > 1 && currentPage != totalPage && 
                <>
                <span className="next" key="next">
                    <a onClick={() => handleCurrentPageChange(nextPage, pageSize)}>&gt;</a>
                </span>

                <span className="last" key="last">
                    <a  onClick={() => handleCurrentPageChange(lastPage, pageSize)}>&gt;&gt;</a>
                </span>               
                </>
            }
            <select defaultValue={pageSize} onChange={(e) => {
                setPageSize(e.target.value)                
                handleCurrentPageChange(pageChange, e.target.value)
            }}>
                <option value="5">5条/页</option>
                <option value="10">10条/页</option>
                <option value="20">20条/页</option>
                <option value="50">50条/页</option>
                <option value="100">100条/页</option>
            </select>
            <span className="customer-page-size">自定义条数</span>
            <input type="text" placeholder="" onChange={(e)=>setPageSize(e.target.value)} />
            <button type="button" className="button small margin-bottom-0 padding-tb hollow success" onClick={()=>handleCurrentPageChange(pageChange, pageSize || 10)}>查询</button>
        </div>
    )
}



export default Pagination