import {Link} from 'react-router-dom'
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
                        <Link onClick={() => handleCurrentPageChange(page, pageSize)}>{page}</Link>
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
                    <Link onClick={() => handleCurrentPageChange(firstPage, pageSize)}>&lt;</Link>
                </span>
        
                <span className="previous" key="prev">
                    <Link onClick={() => handleCurrentPageChange(prevPage, pageSize)}>&lt;&lt;</Link>
                </span>
               </>
            }

            <PageItem handleCurrentPageChange={handleCurrentPageChange}/>

            {totalPage > 1 && currentPage != totalPage && 
                <>
                <span className="next" key="next">
                    <Link onClick={() => handleCurrentPageChange(nextPage, pageSize)}>&gt;</Link>
                </span>

                <span className="last" key="last">
                    <Link  onClick={() => handleCurrentPageChange(lastPage, pageSize)}>&gt;&gt;</Link>
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
        </div>
    )
}



export default Pagination