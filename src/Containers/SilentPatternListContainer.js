// @flow
import * as React from "react";
import type {ContextRouter} from "react-router-dom";
import type {IMoiraApi} from "../Api/MoiraAPI";
import type {SilentPattern} from "../Domain/SilentPattern";
import {withMoiraApi} from "../Api/MoiraApiInjection";
import SilentPatternList from "../Components/SilentPatternList/SilentPatternList";
import Layout, {LayoutContent, LayoutTitle} from "../Components/Layout/Layout";
import NewSilentPattern from "../Components/NewSilentPattern/NewSilentPattern";

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {
    loading: boolean,
    error: ?string,
    list: ?Array<SilentPattern>,
};

class SilentPatternListContainer extends React.Component<Props, State> {
    props: Props;
    state: State = {
        loading: true,
        error: null,
        list: null,
    };

    componentDidMount() {
        this.getData(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
        this.setState({loading: true});
        this.getData(nextProps);
    }

    async getData(props: Props): Promise<void> {
        const {moiraApi} = props;
        try {
            const patterns = await moiraApi.getSilentPatternList();
            this.setState({loading: false, ...patterns});
        } catch (error) {
            this.setState({error: error.message});
        }
    }

    async removeSilentPattern(pattern: string): Promise<void> {
        this.setState({loading: true});
        try {
            await this.props.moiraApi.delSilentPattern(pattern);
            this.getData(this.props);
        } catch (error) {
            this.setState({error: error.message});
        }
    }

    async addSilentPattern(silentPattern: SilentPattern): Promise<void> {
        this.setState({loading: true});
        try {
            await this.props.moiraApi.addSilentPattern(silentPattern);
            this.getData(this.props);
        } catch (error) {
            this.setState({error: error.message});
        }
    }

    async updateSilentPattern(silentPattern: SilentPattern, until: number): Promise<void> {
        silentPattern.until = until;
        this.setState({loading: true});
        try {
            await this.props.moiraApi.delSilentPattern(silentPattern.pattern);
            await this.addSilentPattern(silentPattern);
        } catch (error) {
            this.setState({error: error.message});
        }
    }

    render(): React.Node {
        const {loading, error, list} = this.state;
        return (
            <Layout loading={loading} error={error}>
                <LayoutContent>
                    <LayoutTitle>Silent patterns</LayoutTitle>
                    <NewSilentPattern onCreate={silentPattern => this.addSilentPattern(silentPattern)}/>

                    {list && (
                        <SilentPatternList
                            items={list}
                            onChange={(silentPattern, offset) =>
                                this.updateSilentPattern(silentPattern, offset)
                            }
                            onRemove={pattern => {
                                this.removeSilentPattern(pattern);
                            }}
                        />
                    )}
                </LayoutContent>
            </Layout>
        );
    }
}

export default withMoiraApi(SilentPatternListContainer);
